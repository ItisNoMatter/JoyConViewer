import { connectJoyCon, connectedJoyCons, JoyConLeft } from '../node_modules/joy-con-webhid/dist/index.js';
const connect_button = document.querySelector('#connect-joy-cons')
const X_button = document.querySelector('#x_button')
const Y_button = document.querySelector('#y_button')
const A_button = document.querySelector('#a_button')
const B_button = document.querySelector('#b_button')

const ctx = document.querySelector('#myChart')

let gyro_x_value
let gyro_y_value
let gyro_z_value

connect_button.addEventListener('click',connectJoyCon)

const counter = document.querySelector('#counter')
let counter_value = 0

let elapsed_time = 0
let last_called_time = 0

const visualize = (joyCon,packet) => {
  
    if (!packet || !packet.actualOrientation) {
        return;
      }
    const buttons = packet.buttonStatus
    const joystick = packet.analogStickRight

    X_button.classList.toggle("highlight",buttons.x)
    Y_button.classList.toggle("highlight",buttons.y)
    A_button.classList.toggle("highlight",buttons.a)
    B_button.classList.toggle("highlight",buttons.b)

    const gyroscope = packet.actualGyroscope
    const gyroMultiplier = 100
    gyro_x_value = gyroscope.rps.x * gyroMultiplier
    gyro_y_value = gyroscope.rps.y * gyroMultiplier
    gyro_z_value = gyroscope.rps.z * gyroMultiplier

    //シェイク検出
    if (Math.abs(gyro_y_value) > 0.99){
      elapsed_time = Date.now() - last_called_time
      if (elapsed_time > 1000){
        counter_value += 1
        last_called_time = Date.now()
      }
    }
    counter.innerHTML = counter_value

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

  
  
  const config = {
    type: 'line',
    data: {
      datasets: [
        { 
          label: "gyro_x",
          data: [],
          pointRadius: 1,
          borderColor: 'rgb(255, 0, 0)'
        },
        { 
          label: "gyro_y",
          data: [],
          pointRadius: 1,
          borderColor: 'rgb(0, 255, 0)'
        },
        { 
          label: "gyro_z",
          data: [],
          pointRadius: 1,
          borderColor: 'rgb(0, 0, 255)'
        },
      ]
    },
    responsive:true,
    
    options: {
      layout: {
        padding: {
            left: 0,
            right: 200,
            top: 0,
            bottom: 0
        }
      },
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay:1,
            duration:20000,
            refresh:1,
            onRefresh: chart => {
              
              chart.data.datasets[0].data.push({
                x: Date.now(),
                y: gyro_x_value
              })
              chart.data.datasets[1].data.push({
                x: Date.now(),
                y: gyro_y_value
              })
              chart.data.datasets[2].data.push({
                x: Date.now(),
                y: gyro_z_value
              })

              

            }
          }
        }
      }
    }
  };

  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );