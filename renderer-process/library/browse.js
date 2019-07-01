const {ipcRenderer} = require('electron')

const ChorusAPI = require("../../module/chorus-api")

const getLatest = document.getElementById('call-get-latest');
const latestList = document.getElementById('get-latest-result-list');
const getRandom = document.getElementById('call-get-random');
const randomList = document.getElementById('get-random-result-list');

getLatest.addEventListener('click', () => {
    ipcRenderer.send('get-latest');
    
})
ipcRenderer.on('latest-songs', (songs) => {
    songs.forEach(song => {
        const li = document.createElement('li')
        li.id = song.name + "_" + song.artist
        latestList.appendChild(li);
    });
})

getRandom.addEventListener('click', () => {
    ipcRenderer.send('get-random');
})
ipcRenderer.on('random-songs', (songs) => {
    songs.forEach(song => {
        const li = document.createElement('li')
        li.id = song.name + "_" + song.artist
        randomList.appendChild(li);
    });
})
