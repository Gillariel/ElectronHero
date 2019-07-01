const {ipcMain, dialog, app} = require('electron')
const fs = require('fs');
const midiReader = require('midi-file');

ipcMain.on('open-import-midi', (event, args) => {
    console.log(app.getAppPath() + args.path);
    dialog.showOpenDialog({
        filters: [
            { name: 'MIDI', extensions: ['mid', 'chart'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile'],
        defaultPath: app.getAppPath() + args.path,
    }, (files) => {
        if (files && files[0]) {
            var file = files[0];
            var filesplitted = file.split('\\').reverse();
            var friendlyFileName = filesplitted[1];
            event.sender.send('selected-file-name', friendlyFileName);
            const byteFile = fs.readFileSync(file);
            const decodedMidi = midiReader.parseMidi(byteFile);
            event.sender.send('selected-file-data', decodedMidi);
        }
    })
})
