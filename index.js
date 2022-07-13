const express=require('express')
const app=express()
const router=require('./Routers/index')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
var session = require('express-session')
const mqtt = require('mqtt')
const HeartSensor=require('./models/HeartSensor')
const HeartSensorData=require('./models/HeartSensorData')


const client  = mqtt.connect('mqtt://broker.emqx.io:1883')
client.on('connect', function () {
    client.subscribe('esp32/132667/healthcheck', function (err) {
     if(err){
        console.log("subscribed error")
     }else console.log('Server has subscribed successfully')
    })
  })

client.on('message',(topic,message)=>{
    //console.log("message data",message.toString())
    
    try{
        // const objstr=JSON.stringify('{"Id": "E123458","heartRate": "10","bodyTemperature": "10","bloodPressure": "20"}')
        // console.log(typeof(objstr))
        const obj=JSON.parse(message.toString())
        
        console.log("obj: ",obj,typeof(obj),obj.Id)
        HeartSensor.findOne({Id: obj.Id })
        .then(data=>{
            if(data){
                HeartSensorData.create(obj)
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
            console.log("connect bd error")
    })
    }catch(err){
        console.log("error: ",err.message)
    }
    

 
})
  



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