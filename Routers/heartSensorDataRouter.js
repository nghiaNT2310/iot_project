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
                    console.log(data)
                    let se=data.map(i=>{
                        let item={};
                        item._id=i._id
                        item.Id=i.Id
                        item.heartRate=i.heartRate
                        item.bodyTemperature=i.bodyTemperature
                        item.bloodPressure=i.bloodPressure
                        let date=new Date(i.create)
                        
                        item.create=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
                        console.log(item)
                        return item;
                    })
                    
                    res.json(se)
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