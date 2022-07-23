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
                        item.systolic=i.systolic
                        item.diastolic=i.diastolic
                        let date=new Date(i.create)
                        date.setHours(date.getHours()+7);
                        item.create=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
                        let content="";
                        if(i.heartRate<60) content=content+="Nhịp tim chậm\n"
                        else if(req.body.user.age){
                            if(i.heartRate>220-req.body.user.age){
                                content+="Nhịp tim quá nhanh\n"
                            }else if(i.heartRate>100) content+="Nhịp tim nhanh\n"
                        }else if(i.heartRate>100) content+="Nhịp tim nhanh\n"
                        if(i.bodyTemperature>40) content+="Sốt quá cao\n"
                        else if(i.bodyTemperature>39) content+="Sốt cao\n"
                        else if(i.bodyTemperature>38) content+="Hơi sốt\n"
                        if(content!="") item.content=content;
                        console.log("content:",content)
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