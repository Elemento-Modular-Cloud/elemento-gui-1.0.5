const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { spawn } = require('child_process')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ autoHideMenuBar: true })
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.setSize(800, 600, true)
  // mainWindow.setKiosk(true)

  // Start the Node.js API
  try {
    const apiPath = path.join(__dirname, 'api', 'server.js')
    spawn('node', [apiPath], { stdio: 'inherit' })
  } catch (error) {
    window.alert(error)
  }
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
