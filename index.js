import Parser from './parser.js'
import loaders from './loaders/index.js'
import plugins from './plugins/index.js'
import transformers from './transformers/index.js'
import adapters from './adapters/index.js'

const { AddWords, RandomN, HanziOnly, Sort, Uniq, UseExample } = plugins
const IS_DEV = process.env.NODE_ENV === 'development'
const EXAMPLE_DATA = [
  '安全策略',
  '安全过滤器',
  'QQ中心西安饿',
  '是这样昂3',
  'EE样微云一ds应够',
]

const userDic = await new Parser({
  inputs: ['./resources/plist'],
  loaders: [loaders.PlistLoader()],
}).do()

const config = {
  inputs: ['./resources/txt'],
  loaders: [loaders.TxTLoader()],
  plugins: [
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    HanziOnly(),
    Uniq(),
    RandomN(2e3),
    AddWords(userDic),
  ],
  transformer: transformers.XiaoheTransformer(),
  adapter: adapters.macOSRender(),
  output: './output/macOS_input_dic.plist',
  // log: true,
}

const data = await new Parser(config).do()
// console.log(`data -> ${data}`)
