import path from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

const currentPlatform = process.env.SIMULATED_PLATFORM || process.platform

export function createMainWindow(): BrowserWindow {
  const options = _createDefaultOptions()

  switch (currentPlatform) {
    case 'win32':
      options.titleBarStyle = 'hidden'
      options.titleBarOverlay = {
        color: '#D9D9D9',
        symbolColor: '#000000',
        height: 33
      }
      break
    case 'darwin':
      options.titleBarStyle = 'hiddenInset'
      break
    default:
      options.titleBarStyle = 'default'
      break
  }

  const mainWindow = new BrowserWindow(options)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

export function createModalPopup(modalOptions: ModalWindowConstructOptions): BrowserWindow {
  const options = _createDefaultOptions()
  options.parent = modalOptions.parent
  options.modal = true
  options.width = modalOptions.width
  options.height = modalOptions.height

  const modalWindow = new BrowserWindow(options)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    modalWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + `/${modalOptions.name}.html`)
  } else {
    modalWindow.loadFile(path.join(__dirname, `../renderer/${modalOptions.name}.html`))
  }
  return modalWindow
}

function _createDefaultOptions(): BrowserWindowConstructorOptions {
  const options: BrowserWindowConstructorOptions = {
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: false,
    ...(currentPlatform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  }

  return options
}

export interface ModalWindowConstructOptions {
  parent: BrowserWindow
  name: string
  width: number
  height: number
}
