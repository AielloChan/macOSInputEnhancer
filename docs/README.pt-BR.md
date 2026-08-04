[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | [English](README.en-US.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Français](README.fr-FR.md) | [Español](README.es-ES.md) | Português do Brasil | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# Extensão do método de entrada integrado do macOS

Importe arquivos de dicionário para usá-los com o método de entrada integrado do macOS.

O projeto utiliza principalmente o recurso de substituição de texto integrado ao iOS e ao macOS para ampliar o dicionário: https://support.apple.com/pt-br/guide/iphone/iph6d01d862/ios

Compatibilidade atual:
- **Recursos**
  - [x] Obter todos os arquivos
  - [x] Decodificar um arquivo e extrair todas as frases
  - [x] Converter frases em pronúncias
  - [x] Integrar plugins de métodos de entrada
  - [x] Criar pares de teclas e frases
  - [x] Gerar arquivos para o cliente
  - [x] Oferecer chamadas orientadas a objetos
  - [x] Exportar dados de um intervalo especificado
  - [x] Injetar o dicionário Example na configuração
  - [x] Mesclar dicionários existentes
- **Formatos de entrada**
  - [x] Dicionário celular do Sogou (.scel)
  - [x] Texto simples
  - [x] Formato plist do método de entrada do macOS
- **Conversões**
  - [x] Xiaohe Double Pinyin
- **Formatos de saída**
  - [x] Formato plist do método de entrada do macOS

Os recursos básicos estão concluídos. Agora é possível importar dicionários celulares do Sogou (.scel) para o método de entrada integrado do macOS.

## Como usar

1. Baixe o dicionário celular (.scel) que deseja importar em https://pinyin.sogou.com/dict/
2. Coloque-o no diretório `resources/scel`. O programa ignora automaticamente arquivos cujos nomes começam com `_` e arquivos que não terminam em `.scel`.
3. Instale todas as dependências com `yarn` ou `npm install`.
4. Execute a conversão e a compilação com `yarn run build` ou `npm run build`.
5. Se o processo terminar com sucesso, o arquivo `plist` estará no diretório `output`.
6. Abra Ajustes do Sistema → Teclado → Substituições de Texto e arraste o arquivo `plist` para a lista.

## !!! Aviso importante ⚠️ !!!

Este método de importação substitui diretamente as substituições de texto existentes. Faça um backup antes: selecione todas as entradas e arraste-as para qualquer pasta para exportá-las como um arquivo plist.

Não adicione muitos dicionários de uma só vez. Em um primeiro teste com 20 mil entradas, o computador travou completamente. Para resolver o problema, exclua as entradas e reinicie. O macOS parece não estar muito otimizado para um grande número de substituições de texto.

Recomenda-se adicionar apenas 2.000 entradas na primeira tentativa.

## ✉️ Mensagem do desenvolvedor

Este aplicativo já atende às minhas necessidades, por isso raramente atualizo seus recursos. Se você tiver uma nova solicitação, abra uma Issue para discutirmos novas funcionalidades. Responderei o mais rápido possível no [espaço de discussão](https://github.com/AielloChan/macOSInputEnhancer/issues/1).

## Para desenvolvedores que desejam modificar o projeto

O arquivo de entrada é `index.js`.

Formato do arquivo de configuração:
```javascript
{
  // Diretório a ser verificado (os subdiretórios não são verificados)
  // Retorna um array com os caminhos absolutos de todos os arquivos
  inputs: ['./resources/txt'],
  // Seleciona automaticamente o carregador adequado para cada formato
  // Retorna um array com todas as frases, por exemplo `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // Processa o array anterior: remove duplicatas, ordena, adiciona ou remove itens
  // Retorna um novo array
  plugins: [
    // No modo de desenvolvimento, usa o plugin UseExample
    // Ele substitui todas as entradas anteriores pelos dados de teste
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // Remove das entradas todos os caracteres que não sejam chineses
    HanziOnly(),
    // Remove entradas duplicadas
    Uniq(),
    // Seleciona aleatoriamente a quantidade indicada de entradas
    RandomN(2e3),
    // Adiciona e mescla os dados existentes
    AddWords(userDic),
  ],
  // Converte as frases em teclas conforme o método de entrada
  // A mesma frase tem mapeamentos diferentes em Pinyin, Double Pinyin e Wubi
  // Aqui é usado o transformador Xiaohe Double Pinyin
  transformer: transformers.XiaoheTransformer(),
  // Converte as frases e suas teclas para o formato da plataforma especificada
  // Aqui gera frases personalizadas para o método de entrada do macOS
  adapter: adapters.macOSRender(),
  // Caminho do arquivo de saída
  output: './output/macOS_input_dic.plist',
  // Define se os logs serão exibidos na linha de comando
  log: true,
}
```

A ordem de processamento da configuração é fixa e não pode ser invertida nem reorganizada:

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders: carrega os diferentes formatos de arquivo. O parâmetro é o `caminho absoluto de um único arquivo` e o retorno é um `array de frases`, por exemplo `["你好","今天"]`.
- plugins: recebe um array como `["你好","今天"]` e retorna o mesmo formato depois do processamento. Por exemplo, ao filtrar `"你好"`, retorna `["今天"]`.
- transformer: converte as frases em arrays como `[你好, nihc]`.
- adapter: converte os dados em formatos compatíveis com diferentes plataformas.
