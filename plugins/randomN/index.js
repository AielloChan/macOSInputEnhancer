export default (n) => (words) => {
  const len = words.length
  const rate = n / len
  if (rate >= 1) return words
  let rtn = []
  for (let i = 0, j = n; i < len && j > 0; i++) {
    if (Math.random() <= rate) {
      rtn.push(words[i])
      j--
    }
    if (len - i == j) {
      rtn = rtn.concat(words.slice(i))
      break
    }
  }
  return rtn
}
