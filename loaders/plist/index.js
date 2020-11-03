import path from 'path'
import { promises } from 'fs'
import { parseString } from 'xml2js'
import { promisify } from '../../tools/utils.js'

const EXTENSION = '.plist'
const IGNORE_PREFIX = '_'

export default () =>
  async function (file) {
    if (!file.endsWith(EXTENSION)) return []
    if (path.basename(file).startsWith(IGNORE_PREFIX)) return []

    const xmlContent = await promises.readFile(file)
    const asyncParseString = promisify(parseString)
    const [err, result] = await asyncParseString(xmlContent)
    const array = result.plist.array
    return array.map(({ dict }) => dict.map(({ string }) => string[0])).flat()
  }
