'use strict'

import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import db from '../datastore/index.js' // 取决于你的datastore.js的位置
import pkg from '../../package.json'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.platform === 'win32') {
  app.setAppUserModelId(pkg.build.appId)
}
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = require('path')
    .join(__dirname, '../../static')
    .replace(/\\/g, '\\\\')
}

let window
let settingWindow
let tray
// let menu
let contextMenu
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
const settingWinURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#setting/upload`
    : `file://${__dirname}/index.html#setting/upload`
// const miniWinURL =
//   process.env.NODE_ENV === 'development'
//     ? `http://localhost:9080/#mini-page`
//     : `file://${__dirname}/index.html#mini-page`

const showWindow = bounds => {
  window.setPosition(bounds.x - 98 + 11, bounds.y, false)
  window.webContents.send('updateFiles', 'updateFiles')
  window.show()
  window.focus()
}
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
const toggleWindow = bounds => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow(bounds)
  }
}

const createSettingWindow = () => {
  const options = {
    height: 450,
    width: 800,
    show: false, // 当window创建的时候不用打开
    frame: true,
    center: true,
    fullscreenable: false,
    // resizable: false,
    title: 'PicGo',
    vibrancy: 'ultra-dark', // 窗口模糊的样式
    transparent: true,
    // titleBarStyle: 'hidden', // title-bar的样式——隐藏顶部栏的横条，把操作按钮嵌入窗口
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false
    }
  }
  if (process.platform !== 'darwin') {
    options.show = true // 当window创建的时候打开
    options.frame = false // 创建一个frameless窗口，详情：https://electronjs.org/docs/api/frameless-window
    options.backgroundColor = '#3f3c37'
    options.transparent = false
    options.icon = `${__static}/logo.png`
  }
  settingWindow = new BrowserWindow(options)

  settingWindow.loadURL(settingWinURL)

  settingWindow.on('closed', () => {
    settingWindow = null
    if (process.platform === 'linux') {
      app.quit()
    }
  })
  // createMenu()
  // createMiniWidow()
  return settingWindow
}
function createWindow() {
  /**
   * Initial window options
   */
  if (process.platform !== 'darwin' && process.platform !== 'win32') {
    // 如果平台是win32，也即windows
    return
  }
  window = new BrowserWindow({
    height: 350,
    width: 596, // 196
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    vibrancy: 'ultra-dark',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false
    }
  })

  window.loadURL(winURL)

  window.on('closed', () => {
    window = null
  })
}

app.on('ready', () => {
  createWindow()
  createSettingWindow()
  if (process.platform === 'darwin' || process.platform === 'win32') {
    createTray()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow()
  }
})
function createContextMenu() {
  contextMenu = Menu.buildFromTemplate([
    {
      label: '关于',
      click() {
        console.log('关于')
      }
    },
    {
      label: '打开详细窗口',
      click() {
        console.log('关于')
      }
    },
    {
      label: '选择默认图床',
      type: 'submenu',
      submenu: [
        {
          label: '微博图床',
          type: 'radio',
          click() {
            console.log('关于')
          }
        },
        {
          label: '七牛图床',
          type: 'radio',
          click() {
            console.log('关于')
          }
        },
        {
          label: '腾讯云COS',
          type: 'radio',
          click() {
            console.log('关于')
          }
        },
        {
          label: '又拍云图床',
          type: 'radio',
          click() {
            console.log('关于')
          }
        }
      ]
    }
  ])
}
function createTray() {
  const menubarPic =
    process.platform === 'darwin'
      ? `${__static}/menubar.png`
      : `${__static}/menubar-nodarwin.png`
  tray = new Tray(menubarPic) // 指定图片的路径
  // ... 其他代码
  tray.on('right-click', () => {
    // ...菜单
    // 右键点击
    if (window) {
      window.hide()
    } // 隐藏小窗口
    createContextMenu()
    tray.popUpContextMenu(contextMenu) // 打开菜单
  })
  tray.on('click', () => {
    // 左键点击
    if (process.platform === 'darwin') {
      // 如果是macOS
      toggleWindow() // 打开或关闭小窗口
    } else {
      // 如果是windows
      window.hide() // 隐藏小窗口
      if (settingWindow === null) {
        // 如果主窗口不存在就创建一个
        createSettingWindow()
        settingWindow.show()
      } else {
        // 如果主窗口在，就显示并激活
        settingWindow.show()
        settingWindow.focus()
      }
    }
  })
  tray.on('drag-enter', () => {
    tray.setImage(`${__static}/upload.png`)
  })

  tray.on('drag-end', () => {
    tray.setImage(`${__static}/menubar.png`)
  })
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
