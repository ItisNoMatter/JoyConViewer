import { connectJoyCon, connectedJoyCons, JoyConLeft } from '../node_modules/joy-con-webhid/dist/index.js';
const connect_button = document.querySelector('#connect-joy-cons')
const X_button = document.querySelector('#x_button')
const Y_button = document.querySelector('#y_button')
const A_button = document.querySelector('#a_button')
const B_button = document.querySelector('#b_button')

const JoystickR_horizontal = document.querySelector('#joystickR-horizontal')
const JoystickR_vertical = document.querySelector('#joystickR-vertical')

const gyro_x = document.querySelector('#gyro_x')
const gyro_y = document.querySelector('#gyro_y')
const gyro_z = document.querySelector('#gyro_z')

connect_button.addEventListener('click',connectJoyCon)


const visualize = (jouCon,packet) => {
  
    if (!packet || !packet.actualOrientation) {
        return;
      }
    const buttons = packet.buttonStatus
    const joystick = packet.analogStickRight

    X_button.classList.toggle("highlight",buttons.x)
    Y_button.classList.toggle("highlight",buttons.y)
    A_button.classList.toggle("highlight",buttons.a)
    B_button.classList.toggle("highlight",buttons.b)

    JoystickR_horizontal.innerText = joystick.horizontal 
    JoystickR_vertical.innerText = joystick.vertical 
    

    const gyroscope = packet.actualGyroscope
    const gyroMultiplier = 100
    gyro_x.value = gyroscope.rps.x * gyroMultiplier
    gyro_y.value = gyroscope.rps.y * gyroMultiplier
    gyro_z.value = gyroscope.rps.z * gyroMultiplier

    const joystickMultiplier = 10
    document.querySelector('#stickR').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier    }px) translateY(${joystick.vertical * joystickMultiplier}px)`
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