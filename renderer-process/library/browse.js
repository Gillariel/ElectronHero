const {ipcRenderer} = require('electron')
const ChorusAPI = require("../../module/chorus-api")

const getLatest = document.getElementById('call-get-latest');
const latestList = document.getElementById('get-latest-result-list');
const getRandom = document.getElementById('call-get-random');
const randomList = document.getElementById('get-random-result-list');
const getQuerySearch = document.getElementById('call-get-query-search');
const querySearchList = document.getElementById('get-query-search-result-list');

const handleChorusResponse = (ChorusResponse, listNode, dataCb) => {
    listNode.innerHTML = ""
    if(ChorusResponse.complete){
        if(ChorusResponse.data){
            dataCb(ChorusResponse.data)
        } else {
            const li = document.createElement('li')
            li.id = `${listNode.id}-error`
            li.textContent = "No Result."
            listNode.appendChild(li);
        }
    } else {
        const li = document.createElement('li')
        li.id = `${listNode.id}-error`
        li.textContent = `An Error Occured. Error Message: ${ChorusResponse.data}`
        listNode.appendChild(li);
    }
}

const handleSong = (songs, listNode) => {
    if(songs && songs.length > 0) {
        songs.forEach(song => {
            const li = document.createElement('li')
            li.id = song.name + "_" + song.artist
            li.textContent = `${song.name} - ${song.artist} (${song.year})`
            const songDownloadLinks = song.directLinks
            if(song.directLinks) {
                const downloadLink = document.createElement('a')
                downloadLink.onclick = () => { downloadSong(`${song.name} - ${song.artist} (${song.year})`, songDownloadLinks) }
                downloadLink.innerHTML = `<p style="color: #90ee90; text-decoration: underline">Download</p>`
                li.appendChild(downloadLink);
            }
            listNode.appendChild(li);
        })
    }
}

const downloadSong = (name, links) => {
    ipcRenderer.send('download-song', {
        name: name,
        links: links
    });
}

getLatest.addEventListener('click', () => {
    ChorusAPI.GetLatest((ChorusResponse => {
        handleChorusResponse(ChorusResponse, latestList, data => {
            if(data.songs) {
                handleSong(data.songs, latestList)
            }
        })
    }))  
})

getRandom.addEventListener('click', () => {
    ChorusAPI.GetRandom((ChorusResponse => {
        handleChorusResponse(ChorusResponse, randomList, data => {
            if(data.songs) {
                handleSong(data.songs, randomList)
            }
        })
    }))
})

getQuerySearch.addEventListener('click', () => {
    const query = {
        name: "werewolf",
        artist: "John 5"
    }
    ChorusAPI.GetByQuery(query, (ChorusResponse => {
        handleChorusResponse(ChorusResponse, randomList, data => {
            if(data.songs) {
                handleSong(data.songs, querySearchList)
            }
        })
    }))
})

ipcRenderer.on('song-downloading-progress', (e, data) => {
    console.log(`progress: ${data.progress} / ${data.progressTotal}`);
})

ipcRenderer.on('song-download-error', (e, data) => {
    console.log(`error while downloading song: ${data.error}`);
})

ipcRenderer.on('song-downloaded', (e, data) => {
    console.log("process finished");
    console.log(data);
})
