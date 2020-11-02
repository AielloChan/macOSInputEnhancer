export default (ascending = true) => (words) =>
  words.sort((a, b) => (a - b) * (ascending ? 1 : -1))
