const mongoose=require('mongoose')
const Schema=mongoose.Schema;


const heartSensorDataSchema=new Schema({
    Id: {
        type: String,
        required: true
    },
    heartRate:{
        type: Number
    },
    bodyTemperature:{
        type:Number
    },
    bloodPressure:{
        type:Number
    },
    create:{
        type: Date,
        default: new Date()
    }
})



const HeartSensorDataModer=mongoose.model('HeartSensorData',heartSensorDataSchema);
module.exports=HeartSensorDataModer