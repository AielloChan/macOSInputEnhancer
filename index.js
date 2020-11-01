import process from 'process'
import path from 'path'
import write from 'write'
import { promises } from 'fs'
import { wordToPinyin } from './libs/wordToPinyin.js'
import { asyncMap } from './tools/asyncMap.js'
import { transform as xiaoheTransform } from './transformers/xiaohe/index.js'
import { render as macOSRender } from './adapters/macOS/index.js'
import { loader as scelLoader } from './loaders/scel/index.js'
import { use as useUniq } from './plugins/uniq/index.js'

const IS_DEV = process.env.NODE_ENV === 'development'
const DIR_NAME = path.resolve()
const RESOURCES_DIR = path.relative(DIR_NAME, './resources')
const OUTPUT_DIR = path.relative(DIR_NAME, './output')
const OUTPUT_FILENAME = 'macOS_input_dic.plist'
// const EXAMPLE_DATA = ['QQ中心西安饿', '是这样昂3', 'EE样微云一应够',]
const EXAMPLE_DATA = ['安全策略', '安全过滤器']

let words = EXAMPLE_DATA
console.log(`is dev: ${IS_DEV}`)
if (!IS_DEV) {
  const files = await promises.readdir(RESOURCES_DIR)
  const filePaths = files.map((file) => path.resolve(RESOURCES_DIR, file))
  words = (await asyncMap(filePaths, scelLoader)).flat()
}
if (words.length === 0) {
  process.exit(0)
}

// use plugins
words = useUniq(words)

const pinyins = await asyncMap(words, (word) => wordToPinyin(word))
const shortcuts = await asyncMap(pinyins, (pinyin) => xiaoheTransform(pinyin))
const combined = words.map((word, idx) => [word, shortcuts[idx]])

console.log(`combined.length: ${combined.length}, combined[0]: ${combined[0]}`)

const output = macOSRender(combined)

const outputFile = path.resolve(OUTPUT_DIR, OUTPUT_FILENAME)
await write(outputFile, output)
