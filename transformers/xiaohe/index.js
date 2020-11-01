import table from './table.js'
const { initialTable, vowelTable, bareTable } = table
/**
 *
 * @param {[[全拼,声母,韵母]]} words
 */
export function transform(words) {
  // [
  //   [ [ 'di' ], [ 'd' ], 'i' ],
  //   [ [ 'pei' ], [ 'p' ], 'ei' ],
  //   [ [ 'zhi' ], [ 'zh' ], 'i' ]
  // ]
  return words
    .map(([quanpin, initial, vowel]) => {
      if (initial == vowel) {
        // alphabetic
        return initial
      }
      if (initial == '') {
        // bare initial
        return bareTable[vowel]
      }
      return initialTable[initial] + vowelTable[vowel]
    })
    .join('')
}
