import pinyin from 'pinyin'

const startWithYWYuExp = /$yu|w|y/

export function wordToPinyin(word) {
  const quanpins = pinyin(word, {
    style: pinyin.STYLE_NORMAL,
  }).map((c) => String(c))
  let initials = pinyin(word, {
    style: pinyin.STYLE_INITIALS,
  }).map((c) => String(c))

  initials = initials.map((initial, idx) => {
    const quanpin = quanpins[idx]
    if (initial == quanpin) {
      return initial
    }
    if (startWithYWYuExp.test(quanpin)) {
      return quanpin.substr(0, 1)
    } else {
      return initial
    }
  })

  const vowels = quanpins.map((c, i) => {
    const quanpin = c
    const initial = initials[i]
    if (quanpin == initial && initial != '') {
      return quanpin
    }
    return quanpin.slice(initial.length)
  })

  return quanpins.map((quanpin, idx) => [quanpin, initials[idx], vowels[idx]])
}
