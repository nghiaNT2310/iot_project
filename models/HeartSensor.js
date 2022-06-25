const mongoose=require('mongoose')
const Schema=mongoose.Schema;


const heartSensorSchema=new Schema({
    id_device: {
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    info:{
        type: String
    },
    create:{
        type: Date,
        default: new Date()
    }
})



const HeartSensorModer=mongoose.model('HeartSensor',heartSensorSchema);
module.exports=HeartSensorModer