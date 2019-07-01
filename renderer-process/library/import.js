const {ipcRenderer  } = require('electron')
const { BrowserWindow, dialog } = require('electron').remote
const path = require('path')

var importBtn = document.getElementById('library-import-songs');

importBtn.addEventListener('click', (e) => {
    /*const modalPath = path.join('file://', __dirname, '../../sections/library/import-modal.html')
    const win = new BrowserWindow({
        width: 600,
        minWidth: 600,
        height: 400,
        minHeight: 400,
        title: "Critical Operation.",
        webPreferences: {
            nodeIntegration: true
        },
        frame: true,
        fullscreen: false,
        center: true,
    });
    
    const confirm = () => {
        console.log("start fetching songs....");
        ipcRenderer.send("import-library");
    }

    const abort = () => {
        win = null;
        console.log("abort event received");
    }

    win.on('close', e => { win = null })
    win.addListener('confirm', confirm)
    win.addListener('abort', abort)

    win.loadURL(modalPath);
    win.show();*/
    var response = dialog.showMessageBox(null, {
        message: "DB exists, want to override?",
        buttons: [
            "Abort",
            "Confirm"
        ],
        detail: "rzhvbriujvb",
        type: "warning",
        title: "Critaical Operations"
    })
    if(response == 0) {

    } else {
        console.log("start fetching songs....");
        ipcRenderer.send("import-library");
    }
});

ipcRenderer.on("library-loaded", (e, data) => {

})