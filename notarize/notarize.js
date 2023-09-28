const { notarize } = require('electron-notarize')
const path = require('path')

async function notarizeApp () {
  try {
    console.log('Try to notarize the app...')
    await notarize({
      appBundleId: 'app.elemento.cloud',
      appPath: path.resolve(__dirname, 'dist/mac-arm64/ElectrOS.app'),
      appleId: 'framesystem@icloud.com',
      appleIdPassword: 'mumw-joxm-gdde-lhdq',
      teamId: '9WTDB7G2C7',
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
