import { connectJoyCon, connectedJoyCons, JoyConLeft } from '../node_modules/joy-con-webhid/dist/index.js';
const connect_button = document.querySelector('#connect-joy-cons')
const X_button = document.querySelector('#x_button')
const Y_button = document.querySelector('#y_button')
const A_button = document.querySelector('#a_button')
const B_button = document.querySelector('#b_button')

connect_button.addEventListener('click',connectJoyCon)


const visualize = (jouCon,packet) => {
  
    if (!packet || !packet.actualOrientation) {
        return;
      }
    const buttons = packet.buttonStatus
    
    X_button.classList.toggle("highlight",buttons.x)
    Y_button.classList.toggle("highlight",buttons.y)
    A_button.classList.toggle("highlight",buttons.a)
    B_button.classList.toggle("highlight",buttons.b)
}

setInterval(async () => {
    for (const joyCon of connectedJoyCons.values()) {
      if (joyCon.eventListenerAttached) {
        continue;
      }
      await joyCon.open();
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();
      joyCon.addEventListener('hidinput', (event) => {
        visualize(joyCon,event.detail)
      });
      joyCon.eventListenerAttached = true;
    }
  }, 2000);