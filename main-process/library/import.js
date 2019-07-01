const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');
const ini = require('ini');

let failedSongs = 0;

ipcMain.on('import-library', (e, data) => {
    let libraryPath = app.getAppPath() + "/assets/songs";
    let library = [];
    readDir(libraryPath, library);
    fs.writeFile(app.getAppPath() + "/assets/db_library.json", JSON.stringify(library), (err) => {
        if(err) {
            console.log("saving db of songs failed");
            e.sender.send("library-loaded", library);
        } else {
            console.log("db of songs saved successfully");
            e.sender.send("library-loaded", library);
        }
    });
});

function readDir(srcPath, currentLibrary) {
    var subDirs = getDirectories(srcPath);
    if(subDirs && subDirs.length > 0) {
        subDirs.forEach(subdir => {
            readDir(subdir, currentLibrary);
        })
        // Folders are inside, recursive going on
    } else {
        var files = getFiles(srcPath);
        let song = {
            info: null,
            pathToOgg: "",
            pathToMidi: ""
        };
        let midiPresent = false;
        let oggPresent = false;

        files.forEach((file) => {
            var extension = file.split('.')[1].toLowerCase();
            if(extension === 'ini') {
                try {
                    song.info = ini.parse(fs.readFileSync(file, 'utf-8')).song;
                } catch (error) {
                    failedSongs++;
                    console.log("ini song file not parsable")
                };
            } else if(extension === 'mid' || extension === 'midi') {
                midiPresent = true; song.pathToMidi = file;
            } else if(extension === 'ogg') {
                oggPresent = true; song.pathToOgg = file;
            }
        });
        if(song && song != undefined && midiPresent && oggPresent)
            currentLibrary.push(song);
    }
}

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getFiles(srcPath) {
    return fs.readdirSync(srcPath)
        .map(file => path.join(srcPath, file))
        .filter(path => fs.statSync(path).isFile());
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath)
        .map(file => path.join(srcPath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcPath) {
    return [srcPath, ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive))];
}