const appConfig = require('application-config')('yupihuasheng')
const path = require('path')
const electron = require('electron')
const arch = require('arch')

const APP_NAME = '鱼皮花生'
const APP_TEAM = '亿鸣龙, LLC'
const PACKAGE = require('../package.json')
const APP_VERSION = PACKAGE.version
const MAIN_URL = PACKAGE.author.url
const IS_TEST = isTest()
const PORTABLE_PATH = IS_TEST
  ? path.join(process.platform === 'win32' ? 'C:\\Windows\\Temp' : '/tmp', 'yupihuasheng')
  : path.join(path.dirname(process.execPath), 'Portable Settings')
const IS_PRODUCTION = isProduction()
const IS_PORTABLE = isPortable()

const UI_HEADER_HEIGHT = 38
const UI_TORRENT_HEIGHT = 100

module.exports = {
  ANNOUNCEMENT_URL: MAIN_URL + '/desktop/announcement',
  AUTO_UPDATE_URL: MAIN_URL + '/desktop/update',
  CRASH_REPORT_URL: MAIN_URL + '/desktop/crash-report',
  TELEMETRY_URL: MAIN_URL + '/desktop/telemetry',

  APP_COPYRIGHT: 'Copyright © 2014-2018 ' + APP_TEAM,
  APP_FILE_ICON: path.join(__dirname, '..', 'static', 'yupihuashengFile'),
  APP_ICON: path.join(__dirname, '..', 'static', 'yupihuasheng'),
  APP_NAME: APP_NAME,
  APP_TEAM: APP_TEAM,
  APP_VERSION: APP_VERSION,
  APP_WINDOW_TITLE: APP_NAME + ' (BETA)',

  CONFIG_PATH: getConfigPath(),

  DEFAULT_TORRENTS: [
    {
      testID: 'cosmos',
      name: 'Cosmos Laundromat (Preview)',
      posterFileName: 'cosmosLaundromat.jpg',
      torrentFileName: 'cosmosLaundromat.torrent'
    }
  ],

  DELAYED_INIT: 3000 /* 3 seconds */,

  DEFAULT_DOWNLOAD_PATH: getDefaultDownloadPath(),

  GITHUB_URL: 'https://github.com/webtorrent/webtorrent-desktop',
  GITHUB_URL_ISSUES: 'https://github.com/webtorrent/webtorrent-desktop/issues',
  GITHUB_URL_RAW: 'https://raw.githubusercontent.com/webtorrent/webtorrent-desktop/master',

  HOME_PAGE_URL: MAIN_URL,

  IS_PORTABLE: IS_PORTABLE,
  IS_PRODUCTION: IS_PRODUCTION,
  IS_TEST: IS_TEST,

  OS_SYSARCH: arch() === 'x64' ? 'x64' : 'ia32',

  POSTER_PATH: path.join(getConfigPath(), 'Posters'),
  ROOT_PATH: path.join(__dirname, '..'),
  STATIC_PATH: path.join(__dirname, '..', 'static'),
  TORRENT_PATH: path.join(getConfigPath(), 'Torrents'),

  WINDOW_ABOUT: 'file://' + path.join(__dirname, '..', 'static', 'view', 'about.html'),
  WINDOW_MAIN: 'file://' + path.join(__dirname, '..', 'static', 'view', 'main.html'),
  WINDOW_WEBTORRENT: 'file://' + path.join(__dirname, '..', 'static', 'view', 'yupihuasheng.html'),
  WINDOW_PRELOAD: 'file://' + path.join(__dirname, '.','renderer', 'preload.js'),
  WINDOW_WEB: 'http://www.tcc.com/?v=3',
  WINDOW_INITIAL_BOUNDS: {
    width: 500,
    height: UI_HEADER_HEIGHT + (UI_TORRENT_HEIGHT * 6) // header + 6 torrents
  },
  WINDOW_MIN_HEIGHT: UI_HEADER_HEIGHT + (UI_TORRENT_HEIGHT * 2), // header + 2 torrents
  WINDOW_MIN_WIDTH: 425,

  UI_HEADER_HEIGHT: UI_HEADER_HEIGHT,
  UI_TORRENT_HEIGHT: UI_TORRENT_HEIGHT
}

function getConfigPath () {
  if (IS_PORTABLE) {
    return PORTABLE_PATH
  } else {
    return path.dirname(appConfig.filePath)
  }
}

function getDefaultDownloadPath () {
  if (IS_PORTABLE) {
    return path.join(getConfigPath(), 'Downloads')
  } else {
    return getPath('downloads')
  }
}

function getPath (key) {
  if (!process.versions.electron) {
    // Node.js process
    return ''
  } else if (process.type === 'renderer') {
    // Electron renderer process
    return electron.remote.app.getPath(key)
  } else {
    // Electron main process
    return electron.app.getPath(key)
  }
}

function isTest () {
  return process.env.NODE_ENV === 'test'
}

function isPortable () {
  if (IS_TEST) {
    return true
  }

  if (process.platform !== 'win32' || !IS_PRODUCTION) {
    // Fast path: Non-Windows platforms should not check for path on disk
    return false
  }

  const fs = require('fs')

  try {
    // This line throws if the "Portable Settings" folder does not exist, and does
    // nothing otherwise.
    fs.accessSync(PORTABLE_PATH, fs.constants.R_OK | fs.constants.W_OK)
    return true
  } catch (err) {
    return false
  }
}

function isProduction () {
  if (!process.versions.electron) {
    // Node.js process
    return false
  }
  if (process.platform === 'darwin') {
    return !/\/Electron\.app\//.test(process.execPath)
  }
  if (process.platform === 'win32') {
    return !/\\electron\.exe$/.test(process.execPath)
  }
  if (process.platform === 'linux') {
    return !/\/electron$/.test(process.execPath)
  }
}
