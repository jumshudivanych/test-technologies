(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let redSlider = document.querySelector('#red');
    let greenSlider = document.querySelector('#green');
    let blueSlider = document.querySelector('#blue');
    let on13 = document.querySelector('on13');
    let off13 = document.querySelector('off13');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(3);
      view[0] = parseInt(redSlider.value);
      view[1] = parseInt(greenSlider.value);
      view[2] = parseInt(blueSlider.value);
      port.send(view);
    };

    redSlider.addEventListener('input', onUpdate);
    greenSlider.addEventListener('input', onUpdate);
    blueSlider.addEventListener('input', onUpdate);

    on13.addEventListener('click', function() {
      if (!port) {
        return;
      }
      let view1 = new Uint8Array(0);
      view1[0] = parseInt(on13.value);
      port.send(view1);
    });  
    
     off13.addEventListener('click', function() {
      if (!port) {
        return;
      }
      let view1 = new Uint8Array(0);
      view1[0] = parseInt(off13.value);
      port.send(view1); 
    });  
    
    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();
