const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
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

  // Spawn a new Python process and execute the script
  try {
    const pythonProcess = spawn('python3', [path.join(__dirname, 'python', 'script.py')])
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  } catch (error) {
    window.alert(error)
  }

  // Spawn a new process and execute docker-compose up
  try {
    const dockerComposeProcess = spawn('docker-compose', ['-f', path.join(__dirname, 'docker', 'docker-compose.yml'), 'up', '-d'])
    dockerComposeProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    dockerComposeProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
    dockerComposeProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
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
