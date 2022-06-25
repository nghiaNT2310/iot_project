const express=require('express')
const Account=require('../models/Account')
const router=express.Router()
const bcrypt=require('bcrypt')
const {CheckLoginHasData,CheckLoginNoData}=require('../Middleware/CheckLogin')




router.post('/register',(req,res)=>{
    if(!req.body.username || !req.body.password) res.status(400).json("Missing data!")
    else{
        Account.create(req.body)
        .then(data=>{
            res.json("register successful")
        })
        .catch(err=>{
            console.log(err)
            if(err.code==11000) res.status(401).json("username existed!")
            else res.status(500).json("server error")
        })
    }
})

router.post('/login',(req,res)=>{
    if(!req.body.username || !req.body.password) res.status(400).json("Missing data!")
    else{                                                                             
        Account.findOne({username:req.body.username})
        .then(data=>{
            if(data){
                bcrypt.compare(req.body.password,data.password,(err,same)=>{
                    if(same){
                        req.session.userid=data._id;
                        res.json("login successful")
                    }else{
                        
                        res.status(400).json("Password incorrect")
                    }
                })
            }else{
                res.status(400).json("Username incorrect")
            }
        })
        .catch(err=>{
            res.status(500).json("server error")
        })
    }
})


router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.json("logout successful")
    })
})

router.get('/information',CheckLoginHasData,(req,res)=>{
    var newInfo=req.body.user
    if(newInfo.password) delete newInfo.password
    res.json(newInfo)
})

router.put('/information',CheckLoginNoData,(req,res)=>{
    var newInfo=req.body
    if(req.body.password) delete newInfo.password
    Account.findByIdAndUpdate(req.session.userid,newInfo)
    .then(data=>{
        Account.findById(req.session.userid)
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

router.put('/changePassword',CheckLoginNoData,(req,res)=>{
    if(!req.body.username || !req.body.password) res.status(400).json("Missing data!")
    else{    
        Account.findById(req.session.userid)
        .then(data=>{
            bcrypt.compare(req.body.oldPassword,data.password,(err,same)=>{
                if(same){
                    bcrypt.hash(req.body.newPassword,10,(err,hash)=>{
                        Account.findByIdAndUpdate(req.session.userid,{password: hash})
                        .then(data=>{
                            res.json("Change Password successful")
                        })
                        .catch(err=>{
                            res.status(500).json("server error")
                        })
                    })
                }else{
                    res.status(400).json("Old Password incorrect")
                }
            })
        })
        .catch(err=>{
            res.status(500).json("server error")
        })
    }
})


module.exports=router