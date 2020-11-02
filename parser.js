import fs from 'fs'
import path from 'path'
import write from 'write'
import process from 'process'
import { wordToPinyin } from './libs/wordToPinyin.js'
import { setCanLog, logger } from './tools/logger.js'
import { promiseMap } from './tools/asyncMap.js'
import { isArray, isFunction, isString, isOK } from './tools/utils.js'

const DIR_NAME = path.resolve()
const { readdir } = fs.promises

export default class Parser {
  config = {}
  constructor(config) {
    this.config = config
  }

  //# Get all files
  static async getAllFiles(inputs) {
    if (isArray(inputs)) {
      const files = (
        await promiseMap(inputs, async (input) => {
          const dir = path.resolve(DIR_NAME, input)
          const fileNames = await readdir(dir)
          return fileNames.map((fileName) => path.resolve(dir, fileName))
        })
      ).flat()
      return [false, files]
    }
    logger(`inputs should be array but got ${inputs}`)
    return [true, null]
  }

  //# Load words from files by loader
  static async loadWords(loaders, files) {
    if (isArray(loaders)) {
      const words = (
        await promiseMap(loaders, async (loader) =>
          (await promiseMap(files, loader)).flat(),
        )
      ).flat()
      logger(`🚂  Loaded ${words.length} from ${files.length} files.`)
      return [false, words]
    }
    logger(`loaders should be array but got ${loaders}`)
    return [true, null]
  }

  //# Process words, such as filter or sort
  static async processWords(plugins, words) {
    if (isArray(plugins)) {
      let processedWords = words
      const realPlugins = plugins.filter(Boolean)
      const len = realPlugins.length
      if (len < 1) return this.data

      for (let i = 0; i < len; i++) {
        processedWords = await realPlugins[i](processedWords)
      }
      logger(`🧮  Processed words ${processedWords.length}.`)
      return [false, processedWords]
    }
    logger(`plugins should be array but got ${plugins}`)
    return [true, null]
  }

  //# disassemble words to all kinds of componet
  static async disassemble(words) {
    // TODO: now just disassemble to pinyin
    const disassembled = await promiseMap(words, async (word, idx) => [
      word,
      await wordToPinyin(word),
    ])
    return [false, disassembled]
  }

  //# Transform to different shortcuts
  static async transform(transformer, parts) {
    if (isFunction(transformer)) {
      const combined = await promiseMap(
        parts,
        async (part) => await transformer(part),
      )
      logger(`💻  Word to combined ${combined.length} success.`)
      return [false, combined]
    }
    logger(`transformer should be function but got ${transformer}`)
    return [true, null]
  }

  //# Render to specific type
  static async render(adapter, combined) {
    if (isFunction(adapter)) {
      const rendered = await adapter(combined)
      logger(`💅  Rendered ${combined.length} data success.`)
      return [false, rendered]
    }
    logger(`adapter should be function but got ${adapter}`)
    return [true, null]
  }

  //# Save to file
  static async save(output, rendered) {
    if (isString(output) && output !== '') {
      const absolutePath = path.resolve(DIR_NAME, output)
      await write(absolutePath, rendered)
      logger(`📝  Write to file ${output} success.`)
    } else {
      logger(`output shold be string but got ${output}.`)
    }
  }

  async do() {
    const {
      inputs,
      loaders,
      plugins,
      transformer,
      adapter,
      output,
      log = true,
    } = this.config
    setCanLog(log)

    var [isDone, files] = await Parser.getAllFiles(inputs)
    if (isDone) return []
    var [isDone, words] = await Parser.loadWords(loaders, files)
    if (isDone) return files
    var [isDone, processedWords] = await Parser.processWords(plugins, words)
    if (isDone) return words
    var [isDone, parts] = await Parser.disassemble(processedWords)
    if (isDone) return processedWords
    var [isDone, combined] = await Parser.transform(transformer, parts)
    if (isDone) return parts
    var [isDone, rendered] = await Parser.render(adapter, combined)
    if (isDone) return combined

    await Parser.save(output, rendered)
    return rendered
  }
}
