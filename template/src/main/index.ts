import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import * as Windows from './windows'
import { ipcMain } from 'electron/main'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.github.ohmry')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = Windows.createMainWindow()
      mainWindow.on('ready-to-show', () => {
        if (mainWindow != null) {
          mainWindow.show()
        }
      })
    }
  })

  mainWindow = Windows.createMainWindow()
  mainWindow.on('ready-to-show', () => {
    if (mainWindow != null) {
      mainWindow.show()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC test
ipcMain.on('ping', () => console.log('pong'))