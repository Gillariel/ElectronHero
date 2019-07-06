const { ipcMain, app } = require('electron')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')

const http = require('https')

//const unzip = require('unzip');
const fileType = require('file-type')
const AdmZip = require('adm-zip')
const unrar = require('node-unrar-js')

ipcMain.addListener('download-song', (e, args) => {
  const name = args.name;
  const links = args.links
  const songPath = `${app.getAppPath()}/assets/songs/${name}`
  if (!fs.existsSync(songPath))
    fs.mkdirSync(songPath)
  const archiveLink = Object.keys(links).find(l => l == "archive")
  if (archiveLink != undefined && archiveLink != null) {
    downloadFromZip(songPath, links[archiveLink], e, success => {
      /*if (!success)
        fs.rmdirSync(songPath)*/
      e.sender.send("song-downloaded", success);
    });
  } else {
    // each separate file are available
    downloadPerFile(songPath, links, e, success => {
      /*if (!success)
        fs.rmdirSync(songPath)*/
      e.sender.send("song-downloaded", success);
    });
  }
});

function DownloadAndUnzip(URL) {


}

const downloadFromZip = (songPath, archiveLink, ipc, cb) => {
  //let downloadProgress = 0;
  let name = songPath + "/";
  let ipcRef = ipc;
  axios.get(archiveLink, {
    //onDownloadProgress: (e) => {
    //  ipcRef.sender.send('song-downloading-progress', { 
    //    progress: (e.loaded / e.total) * 100,
    //    progressTotal: 100
    //  });
    //console.log(`Downloading is at ${(e.loaded / e.total) * 100}%...`)
    //},
    headers: { responseType: 'arrayBuffer' }
  }).then((res) => {
    let buffer = Buffer.from(res.data, 'utf-8')
    var extType = fileType(buffer)
    if(extType && extType != undefined) {
      var ext = extType.ext;
      if (ext == 'rar') {
        ipcRef.sender.send('song-download-error', { error: "it is rar" })
        //var allUnrar = unrar.createExtractorFromData(buffer).extractAll();
        /*if (allUnrar[0].state === "SUCCESS") {
          allUnrar[1].files.forEach((file, index )=> {
            if(file.extract[0] == "SUCCESS"){
              var fileExt = FileType(file.extract[1])
              fs.writeFileSync(name + "." + fileExt, file.extract[1])
            } else {
              console.log("file " + index + " was not extracted correctly")
            }
          })
        }*/
      } else if (ext == 'zip') {
        var tmpZipStream = fs.createWriteStream(name + "test.zip");
        var request = http.get(archiveLink, function(response) {
          response.pipe(tmpZipStream);
        });

        tmpZipStream.on('close', function() {
          var zip;
          try {
            zip = new AdmZip(name + "test.zip");
            zip.extractAllTo(name, true)
          } catch (e) {
            console.log('Can not create zip, bad data', e);
          }
        })
        /*ipcRef.sender.send('song-download-error', { error: "it is zip" })
        try {
          zip = new AdmZip(buffer)
          zip.getEntries().extractAllTo(name, true);
        } catch(err) {
          console.log(err)
        } */
      } else {
        ipcRef.sender.send('song-download-error', { error: "Extension unknown. Trying: " + ext })
      }
    } else {
      ipcRef.sender.send('song-download-error', { error: "Extension unknown. Trying: " + extType })
    }

    /*if(res && res.data && res.data != undefined && res.data != undefined) {
      !fs.existsSync(name)
        ? fs.writeFileSync(name + "." + ext, fileType.stream)
        : console.log("file already exists")
      cb(true)
    }*/
  }).catch(err => { ipcRef.sender.send('song-download-error', { error: err.message }); cb(false) })
}

const unzipSong = (path) => {

}

/*const getArchiveType = (FileTypeResult) => {
  switch(FileTypeResult.ext) {
    
  }
}*/

const getExtension = (pseudoExt) => {
  switch (pseudoExt) {
    case "ini": return ".ini"
    case "chart": return ".chart"
    case "mid": return ".mid"
    case "midi": return ".midi"
    case "song.mp3": return ".mp3"
    case "song.ogg": return ".ogg"
    case "album.png": return ".png"
    case "album.jpg": return ".jpg"
    case "album.jpeg": return ".jpeg"
    default: return ""
  }
}

const downloadPerFile = (path, links, ipc, cb) => {
  let progress = 0
  let progressTotal = Object.keys(links).length
  let ipcRef = ipc
  Object.keys(links).forEach(linkKey => {
    let ext = getExtension(linkKey);
    let name = path.split('/')[path.split('/').length - 1]
    if (ext && ext != "") {
      axios.get(links[linkKey], {
        headers: { responseType: "arrayBuffer" }
      }).then(res => {
        if (res.data) {
          !fs.existsSync(`${path}/${name}${ext}`)
            ? fs.writeFileSync(`${path}/${name}${ext}`, res.data)
            : console.log("file already exists")
          progress++;
          ipcRef.sender.send('song-downloading-progress', {
            progress: progress,
            progressTotal: progressTotal
          });
          if (progress == progressTotal) {
            cb(true)
          }
        }
      }).catch(err => { ipcRef.sender.send('song-download-error', { error: err.message }); cb(false) })
    } else {
      progress++
      ipcRef.sender.send('song-downloading-progress', {
        progress: progress,
        progressTotal: progressTotal
      });
    }
  })
}