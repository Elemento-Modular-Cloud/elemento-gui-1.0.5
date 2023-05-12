module.exports = {
  packagerConfig: {
    osxSign: {
      // optionsForFile: (filePath) => {
      //   // Here, we keep it simple and return a single entitlements.plist file.
      //   // You can use this callback to map different sets of entitlements
      //   // to specific files in your packaged app.
      //   return {
      //     entitlements: 'path/to/entitlements.plist'
      //   }
      // }
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: APPLE_ID,
      appleIdPassword: APPLE_PASSWORD, // Apple App-specific password
      teamId: APPLE_TEAM_ID
    }
    // osxNotarize: {
    //   tool: 'notarytool',
    //   appleApiKey: process.env.APPLE_API_KEY,
    //   appleApiKeyId: process.env.APPLE_API_KEY_ID,
    //   appleApiIssuer: process.env.APPLE_API_ISSUER,
    // }
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
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
}
