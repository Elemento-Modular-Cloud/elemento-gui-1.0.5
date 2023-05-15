const { notarize } = require('electron-notarize')
const path = require('path')

async function notarizeApp () {
  try {
    await notarize({
      appBundleId: 'app.elemento.cloud',
      appPath: path.resolve(__dirname, 'dist/mac-arm64/Elemento Cloud App.app'),
      appleId: 'xxxxx',
      appleIdPassword: 'xxxxx',
      teamId: 'xxxx',
      tool: 'notarytool',
      logLevel: 'verbose'
    })

    console.log('Notarization successful')
  } catch (error) {
    console.error('Notarization failed:', error)
    process.exit(1)
  }
}

notarizeApp()
