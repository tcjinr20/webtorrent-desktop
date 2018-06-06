
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

document.addEventListener('ele', function (e) {
  console.log(e.data)
})

window.addManget = function(manget){
  ipcRenderer.send('addManget', manget)
}

window.addTorrentUrl = function (torrent) {
  ipcRenderer.send('addTorrentUrl', torrent)
}

window.addVod = function (vod) {
  ipcRenderer.send('addVod', vod)
}
