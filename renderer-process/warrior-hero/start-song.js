var fs = require('fs');
const midiReader = require('midi-file');

if (Controller.supported) {
    Controller.search();
    window.addEventListener('gc.controller.found', function(event) {
      var controller = event.detail.controller;
      console.log("Controller found at index " + controller.index + ".");
      console.log("'" + controller.name + "' is ready!");
      var midi = fs.readFileSync('./assets/songs/Vardis - I Wanna Be a Guitar Hero (Just for You) (Sygenysis)/notes.mid');
      midiReader.parseMidi(midi, (data) => {
        console.log(data);
      });
    }, false);

    window.addEventListener('gc.controller.lost', function(event) {
      console.log("The controller at index " + event.detail.index + " has been disconnected.");
      console.log(Controller.getController(0));
    }, false);

    window.addEventListener('gc.button.press', function(event) {
      var button = event.detail;
      switch (button.name){
        case "MISCBUTTON_2": {
          var sound = new Howl({ src: ['./assets/fx/Electric Guitar/E2 PMute.mp3'] });
          sound.play();
          break;
        }
        case "MISCBUTTON_3": {
          var sound = new Howl({ src: ['./assets/fx/Electric Guitar/F2 PMute.mp3'] });
          sound.play();
          break;
        }
        case "MISCBUTTON_1": {
          var sound = new Howl({ src: ['./assets/fx/Electric Guitar/B2 PMute.mp3'] });
          sound.play();
          break;
        }
        case "MISCBUTTON_4": {
          var sound = new Howl({ src: ['./assets/fx/Electric Guitar/C2 PMute.mp3'] });
          sound.play();
          break;
        }
        case "MISCBUTTON_5": {
          var sound = new Howl({ src: ['./assets/fx/Electric Guitar/D2 PMute.mp3'] });
          sound.play();
          break;
        }
      }
      console.log(button);
    }, false);
} else console.log("Controller API Not supproted :/")