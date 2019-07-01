const ButtonsMapping = require("../../utils/controller").ButtonsMapping

let controller;
const user_data = {
    GREEN: false,
    RED: false,
    YELLOW: false,
    BLUE: false,
    ORANGE: false,
    WHAMMY: false,
    SP: false,
    SP_AMOUNT: 0,
}

if (Controller.supported) {
    Controller.search();
    window.addEventListener('gc.controller.found', function (event) {
        controller = event.detail.controller;
        let error = document.getElementById("error-inside-game");
        if (error.textContent && error.textContent != "") {
            error.textContent = `"${controller.name}" has been recovered.`
        } else {
            error.textContent = `"${controller.name}" is connected.`
        }
    }, false);

    window.addEventListener('gc.controller.lost', (e) => {
        let lostController = e.detail.controller;
        document.getElementById("error-inside-game").textContent = `"${lostController.name}" has been lost.`;
    }, false);

    window.addEventListener('gc.button.press', (e) => {
        var button = e.detail;
        document.getElementById("blblblbl").textContent = button.name;
        switch (button.name) {
            case ButtonsMapping.GREEN:
                document.getElementById("empty-note-green").src = "./assets/img/notes/green-hopo.png";
                break;
            case ButtonsMapping.RED:
                document.getElementById("empty-note-red").src = "./assets/img/notes/red-hopo.png";
                break;
            case ButtonsMapping.YELLOW:
                document.getElementById("empty-note-yellow").src = "./assets/img/notes/yellow-hopo.png";
                break;
            case ButtonsMapping.BLUE:
                document.getElementById("empty-note-blue").src = "./assets/img/notes/blue-hopo.png";
                break;
            case ButtonsMapping.ORANGE:
                document.getElementById("empty-note-orange").src = "./assets/img/notes/orange-hopo.png";
                break;
            case ButtonsMapping.SELECT:
                if (user_data.SP_AMOUNT >= 50) {
                    user_data.SP = true;
                    console.log("start SP");
                }
                break;
            case ButtonsMapping.STRUM_UP:
                // Do nothing as Strum up is trigger by releasing the key
                // (weird but physical press correspond to virtual release of the strum key)
                break;
            case ButtonsMapping.START:
                // Pause the game?
                break;
        }
    }, false);

    /** Mandatory for AXIS Inputs */
    window.addEventListener('gc.button.hold', (e) => {
        if (e.detail.name == ButtonsMapping.WHAMMY && e.detail.value > 0.2) {
            // Whammy is in use!
            console.log(e.detail);
        } else if(e.detail.name == ButtonsMapping.STRUM && e.detail.value > 0.14 && e.detail.value < 0.15) {
            // Strum Down is when Strum axis is equal to 0.14285719394683838  
            // if here, strum down detected 
        }
    })

    window.addEventListener("gc.button.release", (e) => {
        // Strum UP is when release the strum axis key 
        if(e.detail.name == ButtonsMapping.STRUM) {
            // Strum up Detected
        }
        switch (e.detail.name) {
            case ButtonsMapping.GREEN:
                document.getElementById("empty-note-green").src = "./assets/img/notes/green.png";
                break;
            case ButtonsMapping.RED:
                document.getElementById("empty-note-red").src = "./assets/img/notes/red.png";
                break;
            case ButtonsMapping.YELLOW:
                document.getElementById("empty-note-yellow").src = "./assets/img/notes/yellow.png";
                break;
            case ButtonsMapping.BLUE:
                document.getElementById("empty-note-blue").src = "./assets/img/notes/blue.png";
                break;
            case ButtonsMapping.ORANGE:
                document.getElementById("empty-note-orange").src = "./assets/img/notes/orange.png";
                break;
        }
    })

    /*window.addEventListener('gc.analog.start', (e) => {
        console.log(e);
    });
    window.addEventListener('gc.analog.hold', (e) => {
        console.log(e);
    });
    window.addEventListener('gc.analog.change', (e) => {
        console.log(e);
    });
    window.addEventListener('gc.analog.end', (e) => {
        console.log(e);
    });*/

} else console.log("Controller API Not supproted :/")