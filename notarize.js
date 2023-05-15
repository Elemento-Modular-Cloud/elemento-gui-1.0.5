const { notarize } = require('electron-notarize')
const path = require('path')

async function notarizeApp () {
  try {
    await notarize({
      appBundleId: 'app.elemento.cloud',
      appPath: path.resolve(__dirname, 'dist/mac/Elemento Cloud App.app'),
      appleId: 'your-apple-id-email',
      appleIdPassword: 'your-app-specific-password'
    })

    console.log('Notarization successful')
  } catch (error) {
    console.error('Notarization failed:', error)
    process.exit(1)
  }
}

notarizeApp()
