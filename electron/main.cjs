const { app, BrowserWindow } = require('electron')
const path = require('path')

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 550,
    height: 850,
    minWidth: 550,
    maxWidth: 550,
    minHeight: 850,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      resizable: false,
      fullscreenable: false
    },
    // Window style
    titleBarStyle: 'default',
    show: false, // Show after loading
    backgroundColor: '#f3f4f6'
  })

  // In development, load from Vite server
  // In production, load the built file
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show the window when ready (prevents white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// When Electron is ready
app.whenReady().then(createWindow)

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// On macOS, recreate a window if dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
