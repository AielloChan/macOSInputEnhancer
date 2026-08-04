[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | English | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Français](README.fr-FR.md) | [Español](README.es-ES.md) | [Português do Brasil](README.pt-BR.md) | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# macOS Built-in Input Method Extension

Import dictionary files for use with the macOS built-in input method.

It primarily leverages the built-in Text Replacement feature on iOS and macOS to extend the dictionary: https://support.apple.com/en-us/guide/iphone/iph6d01d862/ios

Currently supports Sogou Input Method files in plain text format:
- **Feature Support**
  - [x] Fetch all files
  - [x] Decode a single file and output all phrases
  - [x] Decode phrases to phonetics
  - [x] Integrate input method plugins
  - [x] Combine into key-phrase pairs
  - [x] Output client files
  - [x] Support object-oriented calling methods
  - [x] Support outputting data for any specified range
  - [x] Inject Example dictionary into configuration file
  - [x] Support merging with existing dictionaries
- **Input Support**
  - [x] Sogou cell dictionary (.scel)
  - [x] Plain text format
  - [x] macOS built-in input method plist format
- **Conversion Support**
  - [x] Xiaohe Double Pinyin
- **Output Support**
  - [x] macOS built-in input method plist format

Basic functionality is complete. It now supports importing Sogou Input Method cell dictionaries (.scel) into the macOS built-in input method.

## Usage Steps

1. Download the cell dictionary (.scel) you want to import from https://pinyin.sogou.com/dict/
2. Place it in the `resources/scel` directory. The program will automatically ignore files starting with `_` and files not ending with `.scel`.
3. Install all dependencies using `yarn` or `npm install`.
4. Run the conversion and build process with `yarn run build` or `npm run build`.
5. Upon success, your `plist` file will be available in the `output` directory!
6. Open macOS Settings -> Keyboard -> Text, and drag the `plist` file into the text list.

## !!! Important Warning ⚠️ !!!

This import method will directly overwrite your existing text replacements. Please back up beforehand. To back up, select all entries, drag them into any folder, and they will be exported as a plist file.

Do not import too many dictionaries at once. I initially tested with 20k entries, which caused my computer to freeze completely. The solution is to delete the entries and restart. It seems macOS does not heavily optimize these text replacement entries.

It is recommended to add only 2,000 entries on the first try.

## ✉️ A Message from the Developer

This application already meets my needs, so I rarely update its features. However, if you have new requirements, feel free to open an Issue. We can discuss adding new features, and I 🤩 will respond quickly in the [Discussion Area](https://github.com/AielloChan/macOSInputEnhancer/issues/1)

## For Developers Who Want to Tinker

Directory Structure and Features

The entry file is `index.js`.

Configuration File Format
```javascript
{
  // Directory to scan (subdirectories will not be scanned)
  // Returns an array of absolute paths for all files
  inputs: ['./resources/txt'], 
  // Loaders: automatically selects the appropriate loader for different file formats
  // Returns an array of all phrases, e.g., `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // Plugins: process the array returned above (e.g., deduplicate, sort, add, remove, etc.)
  // And return a new array
  plugins: [ 
    // For example, if in development mode, use the UseExample plugin
    // This plugin replaces all previous entry data with test data
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // This plugin removes all non-Chinese characters from the entries
    HanziOnly(),
    // Deduplicate entries
    Uniq(),
    // Randomly select a specified number of entries
    RandomN(2e3),
    // Add entry data
    // Merges with existing data here
    AddWords(userDic),
  ],
  // Input method transformer
  // Converts phrases into key inputs based on the input method type.
  // For the same phrase,
  // Pinyin, Double Pinyin, and Wubi have different key mappings.
  // This uses the Xiaohe Double Pinyin transformer.
  transformer: transformers.XiaoheTransformer(),
  // Adapter: formats entries and their corresponding keys into the specified platform's file format
  // Here, it outputs to macOS built-in input method custom phrases
  adapter: adapters.macOSRender(),
  // Specify the directory where the output file will be saved
  output: './output/macOS_input_dic.plist',
  // Whether to output logs to the command line
  log: true,
}
```

The configuration file is sequential. The processing pipeline cannot be reversed or reordered, and must strictly follow:

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders: Responsible for loading different file formats. Input parameter is the `absolute path of a single file`. Returns an `array of phrases`, e.g., `["你好","今天"]`.
- plugins: Accepts an array of entries, e.g., `["你好","今天"]`. After processing, it outputs an array in the same format. For example, to filter out `"你好"`, it would return `["今天"]`.
- transformer: Converts entries into arrays like `[你好, nihc]`.
- adapter: Converts data into formats compatible with different platforms.
