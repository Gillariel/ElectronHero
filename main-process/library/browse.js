const {ipcMain} = require('electron')

const ChorusAPI = require("../../module/chorus-api")

ipcMain.on('get-latest', (e) => {
    ChorusAPI.GetLatest((songs => {
        e.sender.send('latest-songs', songs);
    }));
})

ipcMain.on('get-random', (e) => {
    ChorusAPI.GetRandom((songs => {
        e.sender.send('random-songs', songs);
    }));
})