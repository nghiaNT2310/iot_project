const express =require('express')
const router=express.Router()
const HeartSensorData=require('../models/HeartSensorData')
const HeartSensor=require('../models/HeartSensor')
const {CheckLoginHasData,CheckLoginNoData}=require('../Middleware/CheckLogin')

router.get('/:id',(req,res)=>{
    HeartSensorData.find({id_device: req.params.id})
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json('server error')
    })
})

module.exports=router