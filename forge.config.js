module.exports = {
  packagerConfig: {
    name: 'ElectrOS',
    icon: './icons/icon',
    osxSign: {
      identity: 'Developer ID Application: Elemento SRL (9WTDB7G2C7)', // the name of your Developer ID certificate
      optionsForFile: (filePath) => {
        // Here, we keep it simple and return a single entitlements.plist file.
        // You can use this callback to map different sets of entitlements
        // to specific files in your packaged app.
        return {
          entitlements: 'entitlements.mac.plist'
        }
      }
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: 'framesystem@icloud.com',
      appleIdPassword: 'mumw-joxm-gdde-lhdq', // Apple App-specific password
      teamId: '9WTDB7G2C7'
    },
    ignore: [
      'dist',
      'notarize',
      'out',
      '.env',
      '.gitignore',
      'forge.config.js'
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // certificateFile: './cert.pfx',
        // certificatePassword: CERTIFICATE_PASSWORD
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './icons/icon.png'
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
}
