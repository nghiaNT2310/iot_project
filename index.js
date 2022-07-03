const express=require('express')
const app=express()
const router=require('./Routers/index')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
var session = require('express-session')
const mqtt = require('mqtt')
const HeartSensor=require('./models/HeartSensor')
const HeartSensorData=require('./models/HeartSensorData')
var awsIot = require('aws-iot-device-sdk');


var device = awsIot.device({
    keyPath: './AWS_Rasperry_secrets/private.pem.key',
    certPath: './AWS_Rasperry_secrets/certificate.pem.crt',
    caPath: './AWS_Rasperry_secrets/RootCA1.pem',
    clientId: 'esp32',
    port: 8883,
    host: 'aj6h0rvv35htm-ats.iot.us-west-2.amazonaws.com',
});

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('esp32')
  });

  // device
  // .on('message', function(topic, payload) {
  //   console.log('message', topic, payload.toString());
  // });

device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
    let obj=JSON.parse(payload.toString())
    
    HeartSensor.findOne({Id: obj.Id })
    .then(data=>{
        if(data){
            HeartSensorData.create(JSON.parse(payload.toString()))
            .then(data=>{
                console.log("add successful")
            })
            .catch(err=>{
                console.log(err)
                console.log("broker error")
            })
        }else{
            console.log("device khong ton tai")
        }
    })
    .catch(err=>{
        console.log(err)
        console.log("connect bd error")
    })

  });


 

device.on('error',(err)=>{
    console.log("connect error:",err)
})

// esp32 {
//     "Id": "mac",
//     "heartRate":"80.96",
//     "bodyTemperature":"36.89",
//     "bloodPressure":"123.66"
//   }
// const client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
// client.on('connect', function () {
//     client.subscribe('/ktmt/iot', function (err) {
//      if(err){
//         console.log("subscribed error")
//      }else console.log('Server has subscribed successfully')
//     })
//   })

// client.on('message',(topic,message)=>{
//     console.log(message.toString())

//     var obj=JSON.parse(message.toString())
//     console.log(obj)
//     HeartSensor.findOne({id_device: obj.id_device })
//     .then(data=>{
//         if(data){
//             HeartSensorData.create(JSON.parse(message.toString()))
//             .then(data=>{
//                 console.log("add successful")
//             })
//             .catch(err=>{
//                 console.log(err)
//                 console.log("broker error")
//             })
//         }else{
//             console.log("device khong ton tai")
//         }
//     })
//     .catch(err=>{
//         console.log("connect bd error")
//     })

 
// })
  



const port=3000

app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(bodyParser.json())
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://nghiango:nghiango23102001@cluster0.pjnmw.mongodb.net/IOT?retryWrites=true&w=majority', {
           
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect Successfully!!');
    } catch (error) {
        console.log('Connect failure!!');
    }
}

app.use( function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
   
    next()
  });
  
connect()

router(app)

app.listen(process.env.PORT||3000,()=>{
    console.log("Listen on port 3000!")
})