const { app, BrowserWindow } = require('electron')
const path = require('path')
// const isDev = require('electron-is-dev')
// const { spawn } = require('child_process')
const os = require('os')

let mainWindow

function createWindow () {
  let icon
  if (os.type() === 'Windows_NT') {
    icon = path.join(app.getAppPath(), 'logo.ico')
  } else if (os.type() === 'Darwin') {
    icon = path.join(app.getAppPath(), 'logo.icns')
  }

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon
  })
  // mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.setSize(1280, 720, true)
  mainWindow.setMinimumSize(800, 600)
  mainWindow.webContents.openDevTools()

  // try {
  //   const apiPath = path.join(__dirname, 'api', 'server.js')
  //   const child = spawn(process.execPath, [apiPath], { stdio: ['ignore', 'ignore', 'ignore'] })
  //   child.stderr.on('data', (data) => {
  //     console.error(`Error from child process: ${data}`)
  //   })
  //   child.on('close', (code) => {
  //     console.log(`Child process exited with code ${code}`)
  //   })
  // } catch (error) {}
}

app.on('ready', createWindow)

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
