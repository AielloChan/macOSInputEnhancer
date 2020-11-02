import path from 'path'
import { promises } from 'fs'

const EXTENSION = '.txt'
const IGNORE_PREFIX = '_'

export default () =>
  async function (file) {
    if (!file.endsWith(EXTENSION)) return []
    if (path.basename(file).startsWith(IGNORE_PREFIX)) return []
    const content = await promises.readFile(file)
    return String(content)
      .split('\n')
      .map((w) => w.replaceAll('\n', ''))
  }
