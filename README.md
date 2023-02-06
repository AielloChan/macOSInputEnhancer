# mac自带输入法扩展

将词库导入到 macOS 自带输入法中使用

主要是借助了 iOS 和 macOS 系统自带的快捷短语功能来扩展词库：https://support.apple.com/zh-sg/guide/iphone/iph6d01d862/ios

现在支持纯文本的格式搜狗输入法的
- **功能支持**
  - [x] 获取所有文件
  - [x] 解码单个文件，输出所有字
  - [x] 通过字解码为发音
  - [x] 接入输入法插件
  - [x] 组合为键-文字的组合
  - [x] 输出客户端文件
  - [x] 支持对象式调用方法
  - [x] 支持输出任意时段的数据
  - [x] 配置文件中注入 Example 字典
  - [x] 支持合并现有词库
- **输入支持**
  - [x] 搜狗细胞词库
  - [x] 纯文本格式
  - [x] macOS 自带输入法 plist 格式
- **转换支持**
  - [x] 小鹤双拼
- **输出支持**
  - [x] macOS 自带输入法 plist 格式

基本功能已完成，现在支持将搜狗输入法的细胞词库导入 macOS自带输入法

## 使用步骤

1. 下载你要导入的细胞词库 https://pinyin.sogou.com/dict/
2. 将其放到 `resources/scel`目录下，程序会自动忽略`_`开头的文件和不是`.scel`结尾的文件
3. 安装所有依赖 `yarn` 或者 `npm install`
4. 执行转换打包 `yarn run build` 或 `npm run build`
5. 成功后，在 output 目录下就有你的 `plist` 文件了!
6. 打开 macOS 的设置->键盘设置->文字，然后将 `plist` 文件拖到文本列表里即可

## ！！！注意⚠️！！！

该导入方式会直接覆盖原有的快捷输入，请提前备份，备份方法就是全选，然后将文字拖到任何文件夹即可导出为 plist 格式文件

不要一次性加入太多词库，我一开始试了 20k 条，结果电脑卡得完全不能用，解决办法是删除词条并重启就好了。估计是macOS并没有对这些词条做太多优化。

建议第一次只添加 2 千条

## ✉️一条来自开发者的留言

此应用对于我的需求已经足够，所以我很少会更新其功能。但如果你有新的需求，可以提 Issues，我们可以讨论增加新功能，🤩会很快 [评论专区](https://github.com/AielloChan/macOSInputEnhancer/issues/1)

## 给想要自己搞搞的开发者

目录结构以及功能

入口文件为 index.js

配置文件格式
```javascript
{
  // 需要扫描的目录，不会扫描其子目录文件
  // 返回所有文件绝对目录的数组
  inputs: ['./resources/txt'], 
  // 加载器，不同文件格式自动使用对应的加载器
  // 返回所有短语的数组，如`["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // 插件，其只能处理上面返回的数组，比如去重、排序、增加、删除等等
  // 并且返回新的数组
  plugins: [ 
    // 比如这个，表示如果是开发模式，就使用 UseExample 插件
    // 这个插件会将之前的所有词条数据直接替换成测试数据
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // 这个插件会将所有词条中的所有非中文字符除掉 
    HanziOnly(),
    // 词条去重
    Uniq(),
    // 随机选取指定条数的词条数据
    RandomN(2e3),
    // 添加词条数据
    // 这里添加了已有数据，做了合并
    AddWords(userDic),
  ],
  // 输入法转换器
  // 可以利用已有消息将其转换为按键，如
  // 因为对于同一个词条
  // 拼音、双拼、五笔，他们的按键是不一样的
  // 这里是使用了小鹤双拼的转换器
  transformer: transformers.XiaoheTransformer(),
  // 适配器，用来将词条和对应按键输出为指定平台的文件格式
  // 此处是输出为 macOS 自带输入法的的用户自定义短语
  adapter: adapters.macOSRender(),
  // 指定输出文件存放的目录
  output: './output/macOS_input_dic.plist',
  // 是否在命令行输出 log
  log: true,
}
```

配置文件是有序的，就是流程不能反着或者乱序来，只能是

`inputs`->`loaders`->`plugins`->`transformer`->`adapter`->`output`

- loaders: 负责加载不同的文件格式，入参为`单个文件绝对路径`，返回值为`短语的数组`，如`["你好","今天"]`
- plugins：插件，接受数组格式的词条，如`["你好","今天"]`，处理后同样输出为数组格式，比如要过滤掉`"你好"`，就可以返回`["今天"]`
- transformer：用来将词条转换为 [你好, nihc] 这样的数组
- adapter：转换为不同平台的数据格式


