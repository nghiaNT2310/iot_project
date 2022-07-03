const express =require('express')
const router=express.Router()
const {CheckLoginHasData,CheckLoginNoData,CheckLoginForLogout}=require('../Middleware/CheckLogin')
const HeartSensor=require('../models/HeartSensor')
const Account=require('../models/Account')
router.get("/",CheckLoginHasData,(req,res)=>{
    HeartSensor.find({username:req.body.user.username})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json("server error")
    })
})

router.post("/",CheckLoginForLogout,(req,res)=>{
    if(! req.body.Id) res.status(400).json("Missing data!")
    else{
        const newDevice=req.body
         Account.findById(req.headers._id)
        .then(user=>{
            newDevice.username=user.username
            HeartSensor.create(newDevice)
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(err=>{
                if(err.code==11000) res.status(450).json("Device existed")
                else res.status(500).json("server error")
            })
        })
    }
    
})

router.put("/:id",CheckLoginNoData,(req,res)=>{
    var newInfo=req.body
    if(newInfo.Id) delete newInfo.Id
    HeartSensor.findByIdAndUpdate(req.params.id,newInfo)
    .then(data=>{
        HeartSensor.findById(req.params.id)
        .then(data=>{
            res.status(200).json(data)
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
        if(data) res.status(200).json("delete successful")
        else res.status(440).json("Device is not exist")
    })
    .catch(err=>{
        res.status(500).json("server error")
    })
})

module.exports=router