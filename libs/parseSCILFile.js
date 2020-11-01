import { promises } from 'fs'
import ScelParser from 'scel-parser'

export async function getAllWordsFromSCELFile(filePath) {
  const data = await promises.readFile(filePath)
  const parser = new ScelParser.default(data)
  const wordsInfo = parser.parseWords()
  const sortedWords = wordsInfo.sort((a, b) => b.frequency - a.frequency)

  const words = sortedWords.map(({ word }) => word)
  return words
}
