[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | [English](README.en-US.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Français](README.fr-FR.md) | [Español](README.es-ES.md) | [Português do Brasil](README.pt-BR.md) | Deutsch | [Русский](README.ru-RU.md)

# Erweiterung der integrierten macOS-Eingabemethode

Importiere Wörterbuchdateien, um sie mit der integrierten Eingabemethode von macOS zu verwenden.

Das Projekt nutzt hauptsächlich die in iOS und macOS integrierte Textersetzungsfunktion, um das Wörterbuch zu erweitern: https://support.apple.com/de-de/guide/iphone/iph6d01d862/ios

Derzeit unterstützt:
- **Funktionen**
  - [x] Alle Dateien erfassen
  - [x] Eine einzelne Datei dekodieren und alle Phrasen ausgeben
  - [x] Phrasen in ihre Aussprache umwandeln
  - [x] Plugins für Eingabemethoden integrieren
  - [x] Tasten-Phrasen-Paare erzeugen
  - [x] Clientdateien ausgeben
  - [x] Objektorientierte Aufrufe unterstützen
  - [x] Daten aus einem angegebenen Bereich ausgeben
  - [x] Das Example-Wörterbuch in die Konfiguration einfügen
  - [x] Vorhandene Wörterbücher zusammenführen
- **Eingabeformate**
  - [x] Sogou-Zellenwörterbuch (.scel)
  - [x] Reiner Text
  - [x] plist-Format der macOS-Eingabemethode
- **Konvertierungen**
  - [x] Xiaohe Double Pinyin
- **Ausgabeformate**
  - [x] plist-Format der macOS-Eingabemethode

Die Grundfunktionen sind fertiggestellt. Sogou-Zellenwörterbücher (.scel) können nun in die integrierte Eingabemethode von macOS importiert werden.

## Verwendung

1. Lade das gewünschte Zellenwörterbuch (.scel) unter https://pinyin.sogou.com/dict/ herunter.
2. Lege es im Verzeichnis `resources/scel` ab. Das Programm ignoriert automatisch Dateien, deren Name mit `_` beginnt, sowie Dateien, die nicht auf `.scel` enden.
3. Installiere alle Abhängigkeiten mit `yarn` oder `npm install`.
4. Führe die Konvertierung und den Build mit `yarn run build` oder `npm run build` aus.
5. Nach erfolgreicher Ausführung befindet sich die `plist`-Datei im Verzeichnis `output`.
6. Öffne Systemeinstellungen → Tastatur → Textersetzungen und ziehe die `plist`-Datei in die Liste.

## !!! Wichtiger Hinweis ⚠️ !!!

Diese Importmethode überschreibt vorhandene Textersetzungen direkt. Erstelle vorher eine Sicherung: Wähle alle Einträge aus und ziehe sie in einen beliebigen Ordner, um sie als plist-Datei zu exportieren.

Füge nicht zu viele Wörterbücher auf einmal hinzu. Bei einem ersten Test mit 20.000 Einträgen reagierte der Computer überhaupt nicht mehr. Lösche in diesem Fall die Einträge und starte den Computer neu. macOS scheint für eine große Zahl von Textersetzungen nicht ausreichend optimiert zu sein.

Beim ersten Versuch sollten nur 2.000 Einträge hinzugefügt werden.

## ✉️ Nachricht des Entwicklers

Diese Anwendung erfüllt bereits meine Anforderungen, daher aktualisiere ich ihre Funktionen nur selten. Wenn du neue Anforderungen hast, erstelle bitte ein Issue, damit wir zusätzliche Funktionen besprechen können. Im [Diskussionsbereich](https://github.com/AielloChan/macOSInputEnhancer/issues/1) antworte ich so schnell wie möglich.

## Für Entwickler, die das Projekt anpassen möchten

Die Einstiegsdatei ist `index.js`.

Format der Konfigurationsdatei:
```javascript
{
  // Zu durchsuchendes Verzeichnis (Unterverzeichnisse werden nicht durchsucht)
  // Gibt ein Array mit den absoluten Pfaden aller Dateien zurück
  inputs: ['./resources/txt'],
  // Wählt automatisch den passenden Loader für das jeweilige Dateiformat
  // Gibt ein Array mit allen Phrasen zurück, zum Beispiel `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // Verarbeitet das vorherige Array: Duplikate entfernen, sortieren, hinzufügen oder löschen
  // Gibt ein neues Array zurück
  plugins: [
    // Im Entwicklungsmodus wird das UseExample-Plugin verwendet
    // Es ersetzt alle vorherigen Einträge durch Testdaten
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // Entfernt alle nichtchinesischen Zeichen aus den Einträgen
    HanziOnly(),
    // Entfernt doppelte Einträge
    Uniq(),
    // Wählt zufällig die angegebene Anzahl von Einträgen aus
    RandomN(2e3),
    // Fügt vorhandene Daten hinzu und führt sie zusammen
    AddWords(userDic),
  ],
  // Wandelt Phrasen entsprechend der Eingabemethode in Tastenfolgen um
  // Dieselbe Phrase hat in Pinyin, Double Pinyin und Wubi unterschiedliche Zuordnungen
  // Hier wird der Xiaohe-Double-Pinyin-Transformer verwendet
  transformer: transformers.XiaoheTransformer(),
  // Wandelt Phrasen und Tasten in das Dateiformat der angegebenen Plattform um
  // Hier werden benutzerdefinierte Phrasen für die macOS-Eingabemethode ausgegeben
  adapter: adapters.macOSRender(),
  // Pfad der Ausgabedatei
  output: './output/macOS_input_dic.plist',
  // Legt fest, ob Protokolle in der Kommandozeile ausgegeben werden
  log: true,
}
```

Die Verarbeitungsreihenfolge der Konfiguration ist fest und kann weder umgekehrt noch neu angeordnet werden:

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders: lädt verschiedene Dateiformate. Der Parameter ist der `absolute Pfad einer einzelnen Datei`, zurückgegeben wird ein `Array von Phrasen`, zum Beispiel `["你好","今天"]`.
- plugins: erhält ein Array wie `["你好","今天"]` und gibt nach der Verarbeitung dasselbe Format zurück. Wird beispielsweise `"你好"` herausgefiltert, lautet das Ergebnis `["今天"]`.
- transformer: wandelt Phrasen in Arrays wie `[你好, nihc]` um.
- adapter: wandelt Daten in Formate um, die mit verschiedenen Plattformen kompatibel sind.
