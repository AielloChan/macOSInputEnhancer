const REPLACE_NONE_HANZI_EXP = /[^\u4e00-\u9fa5]/g

export default () => (words) =>
  words.map((word) => word.replace(REPLACE_NONE_HANZI_EXP, ''))
