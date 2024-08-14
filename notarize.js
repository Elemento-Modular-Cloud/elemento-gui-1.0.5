const { notarize } = require('electron-notarize')
const path = require('path')

async function notarizeApp () {
  console.log('Try to notarize the app...')
  await notarize({
    appBundleId: 'app.elemento.cloud',
    appPath: path.resolve(__dirname, 'dist/mac-arm64/ElectrOS.app'),
    appleId: 'fferrando@elemento.cloud',
    appleIdPassword: 'iswt-hmsx-xinw-ppef',
    teamId: '9WTDB7G2C7',
    tool: 'notarytool',
    logLevel: 'verbose'
  })
}

notarizeApp()
