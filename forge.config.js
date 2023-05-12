module.exports = {
  packagerConfig: {
    osxSign: {
      identity: 'Developer ID Application: Your Company Name' // the name of your Developer ID certificate
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: APPLE_ID,
      appleIdPassword: APPLE_PASSWORD, // Apple App-specific password
      teamId: APPLE_TEAM_ID
    }
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
