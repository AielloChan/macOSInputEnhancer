import path from 'path'
import { getAllWordsFromSCELFile } from '../../libs/parseSCELFile.js'

const EXTENSION = '.scel'
const IGNORE_PREFIX = '_'

export default () =>
  async function (file) {
    if (!file.endsWith(EXTENSION)) return []
    if (path.basename(file).startsWith(IGNORE_PREFIX)) return []

    return await getAllWordsFromSCELFile(file)
  }
