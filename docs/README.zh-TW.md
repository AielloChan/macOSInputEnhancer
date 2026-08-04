[简体中文](../README.md) | 繁體中文 | [English](README.en-US.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Français](README.fr-FR.md) | [Español](README.es-ES.md) | [Português do Brasil](README.pt-BR.md) | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# macOS 內建輸入法擴充

將詞庫匯入 macOS 內建輸入法中使用。

主要利用 iOS 和 macOS 系統內建的文字替代功能來擴充詞庫：https://support.apple.com/zh-tw/guide/iphone/iph6d01d862/ios

目前支援情況：
- **功能支援**
  - [x] 取得所有檔案
  - [x] 解碼單一檔案並輸出所有詞句
  - [x] 將詞句轉換為讀音
  - [x] 整合輸入法外掛
  - [x] 組合為按鍵與詞句配對
  - [x] 輸出用戶端檔案
  - [x] 支援物件式呼叫方法
  - [x] 支援輸出指定範圍的資料
  - [x] 在設定檔中注入 Example 詞典
  - [x] 支援合併現有詞庫
- **輸入支援**
  - [x] 搜狗細胞詞庫（.scel）
  - [x] 純文字格式
  - [x] macOS 內建輸入法 plist 格式
- **轉換支援**
  - [x] 小鶴雙拼
- **輸出支援**
  - [x] macOS 內建輸入法 plist 格式

基本功能已完成，目前支援將搜狗輸入法的細胞詞庫（.scel）匯入 macOS 內建輸入法。

## 使用步驟

1. 從 https://pinyin.sogou.com/dict/ 下載要匯入的細胞詞庫（.scel）。
2. 將其放入 `resources/scel` 目錄。程式會自動忽略以 `_` 開頭，以及副檔名不是 `.scel` 的檔案。
3. 使用 `yarn` 或 `npm install` 安裝所有相依套件。
4. 使用 `yarn run build` 或 `npm run build` 執行轉換與建置。
5. 成功後，`output` 目錄中會產生 `plist` 檔案。
6. 開啟 macOS「系統設定」→「鍵盤」→「文字替代」，然後將 `plist` 檔案拖入清單。

## !!! 重要警告 ⚠️ !!!

這種匯入方式會直接覆寫現有的文字替代項目，請事先備份。備份時可全選所有項目，再將它們拖到任意資料夾，即可匯出為 plist 檔案。

請勿一次加入過多詞庫。初次以 2 萬筆項目測試時，電腦完全無法使用；解決方式是刪除項目後重新啟動。macOS 似乎沒有針對大量文字替代項目進行充分最佳化。

建議第一次只加入 2,000 筆項目。

## ✉️ 開發者留言

這個應用程式已能滿足我的需求，因此很少更新功能。如果你有新的需求，歡迎提出 Issue，我們可以討論新增功能。我會盡快在[討論區](https://github.com/AielloChan/macOSInputEnhancer/issues/1)回覆。

## 給想自行修改的開發者

進入點檔案為 `index.js`。

設定檔格式：
```javascript
{
  // 要掃描的目錄（不會掃描子目錄）
  // 傳回所有檔案絕對路徑的陣列
  inputs: ['./resources/txt'],
  // 根據不同檔案格式自動選用對應的載入器
  // 傳回所有詞句的陣列，例如 `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // 處理上述陣列的外掛，例如去重、排序、新增、刪除等
  // 處理後傳回新的陣列
  plugins: [
    // 在開發模式下使用 UseExample 外掛
    // 這個外掛會以測試資料取代先前的所有詞條資料
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // 移除詞條中的所有非中文字元
    HanziOnly(),
    // 移除重複詞條
    Uniq(),
    // 隨機選取指定數量的詞條
    RandomN(2e3),
    // 加入並合併現有詞條資料
    AddWords(userDic),
  ],
  // 根據輸入法類型將詞句轉換為按鍵輸入
  // 相同詞句在拼音、雙拼和五筆中的按鍵對應不同
  // 此處使用小鶴雙拼轉換器
  transformer: transformers.XiaoheTransformer(),
  // 將詞句及對應按鍵轉換為指定平台的檔案格式
  // 此處輸出為 macOS 內建輸入法的自訂詞句
  adapter: adapters.macOSRender(),
  // 指定輸出檔案的儲存路徑
  output: './output/macOS_input_dic.plist',
  // 是否在命令列輸出記錄
  log: true,
}
```

設定檔的處理順序固定，不能反向或任意調整：

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders：負責載入不同檔案格式。輸入參數是`單一檔案的絕對路徑`，傳回值是`詞句陣列`，例如 `["你好","今天"]`。
- plugins：接收 `["你好","今天"]` 之類的詞條陣列，處理後傳回相同格式的陣列。例如過濾掉 `"你好"` 後，會傳回 `["今天"]`。
- transformer：將詞條轉換為 `[你好, nihc]` 之類的陣列。
- adapter：將資料轉換為不同平台相容的格式。
