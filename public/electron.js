const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
// const isDev = require('electron-is-dev')
const os = require('os')
const fs = require('fs')
const https = require('https')

let mainWindow

function createWindow () {
  let icon
  if (os.type() === 'Windows_NT') {
    icon = path.join(app.getAppPath(), 'logo.ico')
  } else if (os.type() === 'Darwin') {
    icon = path.join(app.getAppPath(), 'logo.icns')
  }

  mainWindow = new BrowserWindow({
    icon,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  // mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.setSize(1280, 720, true)
  mainWindow.setMinimumSize(800, 600)
  // mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  createWindow()

  ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url)
  })

  ipcMain.on('download-daemons', () => {
    let url
    let filepath

    const platform = os.platform()

    if (platform === 'win32') {
      url = 'https://repo.elemento.cloud/app/Elemento_daemons.zip'
      filepath = path.join(os.homedir(), 'Downloads', 'Elemento_daemons.zip')
    } else if (platform === 'darwin') {
      if (process.arch.includes('arm')) {
        url = 'https://repo.elemento.cloud/app/Elemento_daemons.dmg'
        filepath = path.join(os.homedir(), 'Downloads', 'Elemento_daemons.dmg')
      } else {
        shell.openExternal('https://github.com/Elemento-Modular-Cloud/electros')
        mainWindow.webContents.send('download-progress', { message: 'chunk', data: { chunk: 100, docker: true } })
      }
    } else if (platform === 'linux') {
      shell.openExternal('https://github.com/Elemento-Modular-Cloud/electros')
      mainWindow.webContents.send('download-progress', { message: 'chunk', data: { chunk: 100, docker: true } })
    } else {
      return 'Error: operating system not supported'
    }

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return `Failed to download file: HTTP status code ${response.statusCode}`
      }

      const totalSize = parseInt(response.headers['content-length'], 10)

      const file = fs.createWriteStream(filepath)
      response.pipe(file)

      let chunks = 0

      response.on('data', (chunk) => {
        chunks += chunk.length
        mainWindow.webContents.send('download-progress', { message: 'chunk', data: { chunk: Math.round((chunks / totalSize) * 100), docker: true } })
      })

      file.on('finish', () => {
        file.close()
        return filepath
      })

      file.on('error', (err) => {
        return err
      })

      response.on('error', (err) => {
        return err
      })
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
