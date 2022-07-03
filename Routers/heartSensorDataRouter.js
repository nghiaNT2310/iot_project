const express =require('express')
const router=express.Router()
const HeartSensorData=require('../models/HeartSensorData')
const HeartSensor=require('../models/HeartSensor')
const {CheckLoginHasData,CheckLoginNoData,CheckLoginForLogout}=require('../Middleware/CheckLogin')

router.get('/:id',CheckLoginHasData,(req,res)=>{
    HeartSensor.findOne({Id:req.params.id})
    .then(device=>{
        if(device){
            if(device.username==req.body.user.username){
                HeartSensorData.find({Id: req.params.id})
                .then(data=>{
                    res.json(data)
                })
                .catch(err=>{
                    res.status(500).json('server error')
                })
            }
            else{
                res.status(491).json("you do not have permission to access this device information")
            }
        }else{
            res.status(440).json("Device is not exist")
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json('server error')
    })
    
})

module.exports=router