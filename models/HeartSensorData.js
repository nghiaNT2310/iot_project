const mongoose=require('mongoose')
const Schema=mongoose.Schema;


const heartSensorDataSchema=new Schema({
    id_device: {
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    create:{
        type: Date,
        default: new Date()
    }
})



const HeartSensorDataModer=mongoose.model('HeartSensorData',heartSensorDataSchema);
module.exports=HeartSensorDataModer