[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | [English](README.en-US.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Français](README.fr-FR.md) | Español | [Português do Brasil](README.pt-BR.md) | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# Extensión del método de entrada integrado de macOS

Importa archivos de diccionario para utilizarlos con el método de entrada integrado de macOS.

El proyecto utiliza principalmente la función de sustitución de texto integrada en iOS y macOS para ampliar el diccionario: https://support.apple.com/es-es/guide/iphone/iph6d01d862/ios

Compatibilidad actual:
- **Funciones**
  - [x] Obtener todos los archivos
  - [x] Decodificar un archivo y extraer todas las frases
  - [x] Convertir frases a su pronunciación
  - [x] Integrar complementos de métodos de entrada
  - [x] Crear pares de teclas y frases
  - [x] Generar archivos para el cliente
  - [x] Admitir llamadas orientadas a objetos
  - [x] Exportar datos de un intervalo especificado
  - [x] Inyectar el diccionario Example en la configuración
  - [x] Combinar diccionarios existentes
- **Formatos de entrada**
  - [x] Diccionario celular de Sogou (.scel)
  - [x] Texto sin formato
  - [x] Formato plist del método de entrada de macOS
- **Conversiones**
  - [x] Xiaohe Double Pinyin
- **Formatos de salida**
  - [x] Formato plist del método de entrada de macOS

Las funciones básicas están terminadas. Ya es posible importar diccionarios celulares de Sogou (.scel) en el método de entrada integrado de macOS.

## Uso

1. Descarga el diccionario celular (.scel) que quieras importar desde https://pinyin.sogou.com/dict/
2. Colócalo en el directorio `resources/scel`. El programa ignora automáticamente los archivos cuyo nombre empieza por `_` y los que no terminan en `.scel`.
3. Instala todas las dependencias con `yarn` o `npm install`.
4. Ejecuta la conversión y la compilación con `yarn run build` o `npm run build`.
5. Si el proceso finaliza correctamente, encontrarás el archivo `plist` en el directorio `output`.
6. Abre Ajustes del Sistema → Teclado → Sustituciones de texto y arrastra el archivo `plist` a la lista.

## !!! Advertencia importante ⚠️ !!!

Este método de importación sobrescribe directamente las sustituciones de texto existentes. Haz una copia de seguridad antes de continuar: selecciona todas las entradas y arrástralas a cualquier carpeta para exportarlas como archivo plist.

No añadas demasiados diccionarios a la vez. En una primera prueba con 20 000 entradas, el ordenador quedó completamente bloqueado. Para solucionarlo, elimina las entradas y reinicia. Parece que macOS no está muy optimizado para una gran cantidad de sustituciones de texto.

Se recomienda añadir solo 2 000 entradas en la primera prueba.

## ✉️ Mensaje del desarrollador

Esta aplicación ya satisface mis necesidades, por lo que rara vez actualizo sus funciones. Si tienes una nueva petición, abre una Issue para que podamos estudiar nuevas funciones. Responderé lo antes posible en el [espacio de discusión](https://github.com/AielloChan/macOSInputEnhancer/issues/1).

## Para desarrolladores que quieran modificar el proyecto

El archivo de entrada es `index.js`.

Formato del archivo de configuración:
```javascript
{
  // Directorio que se va a explorar (no se exploran los subdirectorios)
  // Devuelve un array con las rutas absolutas de todos los archivos
  inputs: ['./resources/txt'],
  // Selecciona automáticamente el cargador adecuado para cada formato
  // Devuelve un array con todas las frases, por ejemplo `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // Procesa el array anterior: elimina duplicados, ordena, añade o elimina elementos
  // Devuelve un array nuevo
  plugins: [
    // En modo de desarrollo se utiliza el complemento UseExample
    // Sustituye todas las entradas anteriores por datos de prueba
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // Elimina de las entradas todos los caracteres que no sean chinos
    HanziOnly(),
    // Elimina las entradas duplicadas
    Uniq(),
    // Selecciona al azar el número indicado de entradas
    RandomN(2e3),
    // Añade y combina los datos existentes
    AddWords(userDic),
  ],
  // Convierte las frases en pulsaciones según el tipo de método de entrada
  // Una misma frase tiene asignaciones distintas en Pinyin, Double Pinyin y Wubi
  // Aquí se utiliza el transformador Xiaohe Double Pinyin
  transformer: transformers.XiaoheTransformer(),
  // Convierte las frases y sus teclas al formato de la plataforma indicada
  // Aquí genera frases personalizadas para el método de entrada de macOS
  adapter: adapters.macOSRender(),
  // Ruta del archivo de salida
  output: './output/macOS_input_dic.plist',
  // Indica si se muestran registros en la línea de comandos
  log: true,
}
```

El orden de procesamiento de la configuración es fijo; no puede invertirse ni reorganizarse:

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders: carga los distintos formatos de archivo. El parámetro es la `ruta absoluta de un único archivo` y devuelve un `array de frases`, por ejemplo `["你好","今天"]`.
- plugins: recibe un array como `["你好","今天"]` y devuelve el mismo formato después de procesarlo. Por ejemplo, al filtrar `"你好"`, devuelve `["今天"]`.
- transformer: convierte las frases en arrays como `[你好, nihc]`.
- adapter: convierte los datos a formatos compatibles con distintas plataformas.
