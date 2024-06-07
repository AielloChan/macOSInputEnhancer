/**
 *
 * @param {[词条,[[全拼,声母,韵母]]]} words
 * @return {[String,String]} - [词条, 键]
 */
export default () =>
  function (words) {
    // [
    //   '低配置',
    //   [
    //     [['di'], ['d'], 'i'],
    //     [['pei'], ['p'], 'ei'],
    //     [['zhi'], ['zh'], 'i'],
    //   ],
    // ]
    const [word, pinyin] = words
    const phrase = pinyin
      .map(([quanpin]) => quanpin)
      .join('')
    return [word, phrase]
  }
