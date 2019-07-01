const {ipcRenderer} = require('electron')

const fileManagerBtn = document.getElementById('import-midi-file-button')

fileManagerBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-import-midi', { path: "\\assets\\songs" })
})
  
ipcRenderer.on('selected-file-name', (event, path) => {
    document.getElementById('import-result-name').innerHTML = `${path}`
})

ipcRenderer.on('selected-file-data', (event, data) => {
    document.getElementById('import-result-data').textContent = `${JSON.stringify(data)}`
    let partHtml = document.getElementById("part-list")
    partHtml.textContent = ""
    let headers = data.header
    let tracks = data.tracks
    console.log(tracks)
    let parts = tracks[1].map((part, index) => {
        if(part.text && part.text.includes("[")) {
            var newPart = document.createElement("li")
            newPart.id = `part-${index}`
            newPart.textContent = part.text
            partHtml.appendChild(newPart)
            return part
        }
    })
    console.log(headers)
})