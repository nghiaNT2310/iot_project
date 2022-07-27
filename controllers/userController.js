const Account=require('../models/Account')
const bcrypt=require('bcrypt')
const {CheckLoginHasData,CheckLoginNoData,CheckLoginForLogout}=require('../Middleware/CheckLogin')
var jwt=require('jsonwebtoken')
class userController{
    register(req,res){
        if(!req.body.username || !req.body.password) res.status(400).json("Missing data!")
        else{
            Account.create(req.body)
            .then(data=>{
                res.status(200).json("register successful")
            })
            .catch(err=>{
                console.log(err)
                if(err.code==11000) res.status(401).json("username existed!")
                else res.status(500).json("server error")
            })
        }
    }
    login(req,res){
        if(!req.body.username || !req.body.password) res.status(400).json("Missing data!")
        else{                                                                             
            Account.findOne({username:req.body.username})
            .then(data=>{
                if(data){
                    bcrypt.compare(req.body.password,data.password,(err,same)=>{
                        if(same){
    
                            var token=jwt.sign({_id:data._id},'nghiango')
                            res.status(200).json(token)
    
                            
                        }else{
                            
                            res.status(402).json("Password incorrect")
                        }
                    })
                }else{
                    res.status(403).json("Username incorrect")
                }
            })
            .catch(err=>{
                res.status(500).json("server error")
            })
        }
    }

    getInfomation(req,res){
        var newInfo=req.body.user
        if(newInfo.password) delete newInfo.password
        res.status(200).json(newInfo)
    }

    updateInformation(req,res){
        var newInfo=req.body
        if(req.body.password) delete newInfo.password
        if(req.body.username) delete newInfo.username
    
        Account.findByIdAndUpdate(req.headers._id,newInfo)
        .then(data=>{
            Account.findById(req.headers._id)
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
        
    }

    changPassword(req,res){
        if(!req.body.oldPassword || !req.body.newPassword) res.status(400).json("Missing data!")
        else{    
            Account.findById(req.headers._id)
            .then(data=>{
                bcrypt.compare(req.body.oldPassword,data.password,(err,same)=>{
                    if(same){
                        bcrypt.hash(req.body.newPassword,10,(err,hash)=>{
                            Account.findByIdAndUpdate(req.headers._id,{password: hash})
                            .then(data=>{
                                res.status(200).json("Change Password successful")
                            })
                            .catch(err=>{
                                res.status(500).json("server error")
                            })
                        })
                    }else{
                        res.status(408).json("Old Password incorrect")
                    }
                })
            })
            .catch(err=>{
                res.status(500).json("server error")
            })
        }
    }


}
module.exports=new userController();