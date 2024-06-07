import adapters from './adapters/index.js'
import loaders from './loaders/index.js'
import Parser from './parser.js'
import plugins from './plugins/index.js'
import transformers from './transformers/index.js'

const { AddWords, Clean, HanziOnly, RandomN, Sort, Uniq, UseExample } = plugins
const IS_DEV = process.env.NODE_ENV === 'development'
const EXAMPLE_DATA = [
  '安全策略',
  '安全过滤器',
  'QQ中心西安饿',
  '是这样昂3',
  'EE样微云一ds应够',
]

// 读取已有的数据
const userDic = await new Parser({
  inputs: ['./resources/plist'],
  loaders: [loaders.PlistLoader()],
}).do()

// 处理词库文件
const config = {
  inputs: ['./resources/scel'], // 需要扫描的目录，不会扫描其子目录
  loaders: [loaders.ScelLoader()], // 使用 scel 格式的加载器
  plugins: [
    IS_DEV ? UseExample(EXAMPLE_DATA) : null, // 如果为开发模式，则会将数据替换为测试数据
    HanziOnly(), //去除词条中的非中文字符，如 `123我(家)😃` 会被处理为 `我家`
    Clean(), // 去除空的词条
    Uniq(), // 去除重复
    RandomN(2e3), // 随机取 2 千个词条
    AddWords(userDic), // 把我们已有的词条加入进去
  ],
  // 转换器，将文本转换为对应键盘打字时的按键，
  // 如 `我家`
  //    用小鹤转换器则会转换为 `wojx`
  //    用拼音转换器则会转换为 `wojia`
  // 如果你不用小鹤双拼输入法，下方可以使用 transformers.PinyinTransformer() 拼音转换器
  transformer: transformers.XiaoheTransformer(), 
  adapter: adapters.macOSRender(), // 适配器，将结果输出为对应平台支持的字库格式
  output: './output/macOS_input_dic.plist', // 文件保存目录
  log: true, // 是否打印日志
}

const data = await new Parser(config).do()
// console.log(`data -> ${data}`)
