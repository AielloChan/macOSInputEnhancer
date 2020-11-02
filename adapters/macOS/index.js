export default () =>
  function (shortcuts) {
    const dicts = shortcuts.map(
      ([phrase, shortcut]) => `<dict>
      <key>phrase</key>
      <string>${phrase}</string>
      <key>shortcut</key>
      <string>${shortcut}</string>
    </dict>
    `,
    )
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
    ${dicts.join('')}
  </array>
</plist>`
  }
