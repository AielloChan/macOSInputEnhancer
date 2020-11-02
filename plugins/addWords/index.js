export default (myWords, isBefore = true) => (words) =>
  isBefore ? myWords.concat(words) : words.concat(myWords)
