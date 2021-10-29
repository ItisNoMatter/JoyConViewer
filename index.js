import { connectJoyCon, connectedJoyCons, JoyConLeft } from './node_modules/joy-con-webhid/dist/index.js';
const connect_button = document.querySelector('#connect-joy-cons')
const X_button = document.querySelector('#x_button')
const Y_button = document.querySelector('#y_button')
const A_button = document.querySelector('#a_button')
const B_button = document.querySelector('#b_button')
const UP_button = document.querySelector('#up_button')
const Left_button = document.querySelector('#left_button')
const Right_button = document.querySelector('#right_button')
const Down_button = document.querySelector('#down_button')


let gyro_x_valueR
let gyro_y_valueR
let gyro_z_valueR
let gyro_x_valueL
let gyro_y_valueL
let gyro_z_valueL


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

    X_button.classList.toggle("highlight",buttons.x)
    Y_button.classList.toggle("highlight",buttons.y)
    A_button.classList.toggle("highlight",buttons.a)
    B_button.classList.toggle("highlight",buttons.b)

    UP_button.classList.toggle("highlight",buttons.up)
    Right_button.classList.toggle("highlight",buttons.right)
    Left_button.classList.toggle("highlight",buttons.left)
    Down_button.classList.toggle("highlight",buttons.down)

    //シェイク検出
    if (Math.abs(gyro_y_valueR) > 0.99){
      elapsed_time = Date.now() - last_called_time
      if (elapsed_time > 1000){
        counter_value += 1
        last_called_time = Date.now()
      }
    }
    counter.innerHTML = counter_value

    const joystickMultiplier = 10
    if (joyCon instanceof JoyConLeft){
      const joystick =  packet.analogStickLeft
      document.querySelector('#stickL').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier    }px) translateY(${joystick.vertical * joystickMultiplier}px)`
      const gyroscope = packet.actualGyroscope
      const gyroMultiplier = 100
      gyro_x_valueR = gyroscope.rps.x * gyroMultiplier
      gyro_y_valueR = gyroscope.rps.y * gyroMultiplier
      gyro_z_valueR = gyroscope.rps.z * gyroMultiplier

    }else{
      const joystick =  packet.analogStickRight
      document.querySelector('#stickR').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier    }px) translateY(${joystick.vertical * joystickMultiplier}px)`
      const gyroscope = packet.actualGyroscope
      const gyroMultiplier = 100
      gyro_x_valueL = gyroscope.rps.x * gyroMultiplier
      gyro_y_valueL = gyroscope.rps.y * gyroMultiplier
      gyro_z_valueL = gyroscope.rps.z * gyroMultiplier
    }
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
    ],
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
          duration:10000,
          refresh:1,
          onRefresh: chart => {
            
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: gyro_x_valueR
            })
            chart.data.datasets[1].data.push({
              x: Date.now(),
              y: gyro_y_valueR
            })
            chart.data.datasets[2].data.push({
              x: Date.now(),
              y: gyro_z_valueR
            })
          }
        }
      }
    }
  }
};
const configL = {
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
    ],
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
          duration:10000,
          refresh:1,
          onRefresh: chart => {
            
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: gyro_x_valueL
            })
            chart.data.datasets[1].data.push({
              x: Date.now(),
              y: gyro_y_valueL
            })
            chart.data.datasets[2].data.push({
              x: Date.now(),
              y: gyro_z_valueL
            })
          }
        }
      }
    }
  }
};


const myChart = new Chart(
  document.getElementById('myChartR'),
  config
);
const myChart2 = new Chart(
  document.getElementById('myChartL'),
  configL
);