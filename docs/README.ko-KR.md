[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | [English](README.en-US.md) | [日本語](README.ja-JP.md) | 한국어 | [Français](README.fr-FR.md) | [Español](README.es-ES.md) | [Português do Brasil](README.pt-BR.md) | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# macOS 기본 입력기 확장

사전 파일을 macOS 기본 입력기에서 사용할 수 있도록 가져옵니다.

iOS와 macOS에 내장된 텍스트 대치 기능을 활용해 사전을 확장합니다: https://support.apple.com/ko-kr/guide/iphone/iph6d01d862/ios

현재 지원 범위:
- **기능 지원**
  - [x] 모든 파일 가져오기
  - [x] 단일 파일을 디코딩하여 모든 문구 출력
  - [x] 문구를 발음으로 변환
  - [x] 입력기 플러그인 연동
  - [x] 키-문구 쌍 생성
  - [x] 클라이언트 파일 출력
  - [x] 객체 방식 호출 지원
  - [x] 지정 범위의 데이터 출력 지원
  - [x] 설정 파일에 Example 사전 주입
  - [x] 기존 사전과 병합 지원
- **입력 형식**
  - [x] Sogou 셀 사전(.scel)
  - [x] 일반 텍스트 형식
  - [x] macOS 기본 입력기 plist 형식
- **변환 지원**
  - [x] Xiaohe Double Pinyin
- **출력 형식**
  - [x] macOS 기본 입력기 plist 형식

기본 기능은 완성되었으며, Sogou 셀 사전(.scel)을 macOS 기본 입력기로 가져올 수 있습니다.

## 사용 방법

1. https://pinyin.sogou.com/dict/ 에서 가져올 셀 사전(.scel)을 다운로드합니다.
2. `resources/scel` 디렉터리에 넣습니다. `_`로 시작하거나 `.scel`로 끝나지 않는 파일은 자동으로 무시됩니다.
3. `yarn` 또는 `npm install`로 모든 의존성을 설치합니다.
4. `yarn run build` 또는 `npm run build`로 변환 및 빌드를 실행합니다.
5. 성공하면 `output` 디렉터리에 `plist` 파일이 생성됩니다.
6. macOS 설정 → 키보드 → 텍스트 대치를 열고 `plist` 파일을 목록으로 드래그합니다.

## !!! 중요 경고 ⚠️ !!!

이 방식으로 가져오면 기존 텍스트 대치 항목을 직접 덮어씁니다. 먼저 백업하세요. 모든 항목을 선택한 뒤 아무 폴더로 드래그하면 plist 파일로 내보낼 수 있습니다.

한 번에 너무 많은 사전을 추가하지 마세요. 처음에 2만 개 항목으로 테스트했을 때 컴퓨터가 완전히 멈췄습니다. 이 경우 항목을 삭제하고 재시작해야 합니다. macOS가 많은 텍스트 대치 항목에 충분히 최적화되어 있지 않은 것으로 보입니다.

처음에는 2,000개 항목만 추가하는 것을 권장합니다.

## ✉️ 개발자의 메시지

이 애플리케이션은 이미 제 요구를 충족하므로 기능을 자주 업데이트하지 않습니다. 새로운 요구 사항이 있다면 Issue를 열어 주세요. 기능 추가를 논의할 수 있으며 [토론 공간](https://github.com/AielloChan/macOSInputEnhancer/issues/1)에 빠르게 답변하겠습니다.

## 직접 수정해 보고 싶은 개발자를 위해

진입 파일은 `index.js`입니다.

설정 파일 형식:
```javascript
{
  // 스캔할 디렉터리(하위 디렉터리는 스캔하지 않음)
  // 모든 파일의 절대 경로 배열을 반환합니다
  inputs: ['./resources/txt'],
  // 파일 형식에 맞는 로더를 자동으로 선택합니다
  // 모든 문구의 배열을 반환합니다. 예: `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // 위 배열을 처리하는 플러그인(중복 제거, 정렬, 추가, 삭제 등)
  // 처리한 새 배열을 반환합니다
  plugins: [
    // 개발 모드라면 UseExample 플러그인을 사용합니다
    // 이전의 모든 항목 데이터를 테스트 데이터로 교체합니다
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // 항목에서 중국어가 아닌 문자를 제거합니다
    HanziOnly(),
    // 중복 항목을 제거합니다
    Uniq(),
    // 지정된 수의 항목을 무작위로 선택합니다
    RandomN(2e3),
    // 기존 데이터를 추가하고 병합합니다
    AddWords(userDic),
  ],
  // 입력 방식에 따라 문구를 키 입력으로 변환합니다
  // 같은 문구도 Pinyin, Double Pinyin, Wubi의 키 매핑은 다릅니다
  // 여기서는 Xiaohe Double Pinyin 변환기를 사용합니다
  transformer: transformers.XiaoheTransformer(),
  // 문구와 키를 지정한 플랫폼의 파일 형식으로 변환합니다
  // 여기서는 macOS 기본 입력기의 사용자 지정 문구로 출력합니다
  adapter: adapters.macOSRender(),
  // 출력 파일 저장 경로
  output: './output/macOS_input_dic.plist',
  // 명령줄에 로그를 출력할지 여부
  log: true,
}
```

설정 파일의 처리 순서는 고정되어 있으므로 역순으로 바꾸거나 순서를 섞을 수 없습니다:

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders: 여러 파일 형식을 불러옵니다. 입력값은 `단일 파일의 절대 경로`이고, `["你好","今天"]`과 같은 `문구 배열`을 반환합니다.
- plugins: `["你好","今天"]`과 같은 문구 배열을 받아 처리한 뒤 같은 형식의 배열을 반환합니다. 예를 들어 `"你好"`를 제외하면 `["今天"]`을 반환합니다.
- transformer: 문구를 `[你好, nihc]`와 같은 배열로 변환합니다.
- adapter: 데이터를 각 플랫폼과 호환되는 형식으로 변환합니다.
