const express =require('express')
const router=express.Router()
const {CheckLoginHasData,CheckLoginNoData}=require('../Middleware/CheckLogin')
const HeartSensor=require('../models/HeartSensor')
const Account=require('../models/Account')
router.get("/",CheckLoginHasData,(req,res)=>{
    HeartSensor.find({username:req.body.user.username})
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json("server error")
    })
})

router.post("/",CheckLoginNoData,(req,res)=>{
    if(! req.body.id_device) res.status(400).json("Missing data!")
    else{
        const newDevice=req.body
         Account.findById(req.session.userid)
        .then(user=>{
            newDevice.username=user.username
            HeartSensor.create(newDevice)
            .then(data=>{
                res.json(data)
            })
            .catch(err=>{
                if(err.code==11000) res.json("Device existed")
                else res.json("server error")
            })
        })
    }
    
})

router.put("/:id",CheckLoginNoData,(req,res)=>{
    var newInfo=req.body
    if(newInfo.id_device) delete newInfo.id_device
    HeartSensor.findByIdAndUpdate(req.params.id,newInfo)
    .then(data=>{
        HeartSensor.findById(req.params.id)
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.status(500).json("server error")
        })
    })
    .catch(err=>{
        res.status(500).json("server error")
    })
})

router.delete("/:id",CheckLoginNoData,(req,res)=>{
    HeartSensor.findByIdAndRemove(req.params.id)
    .then(data=>{
        if(data) res.json("delete successful")
        else res.json("Device is not exist")
    })
    .catch(err=>{
        res.status(500).json("server error")
    })
})

module.exports=router