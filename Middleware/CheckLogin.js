const Account=require('../models/Account')
const jwt=require('jsonwebtoken')
var CheckLoginHasData=(req,res,next)=>{
    if(req.headers.token){
        try{
            
            let token=req.headers.token
            token=token.slice(1,token.length-1)
            console.log(token)
            let data=jwt.verify(token,'nghiango')
            console.log(data)
            Account.findById(data._id)
            .then(data=>{
            if(!data){
                res.status(410).json("you need login")
            }
            else {
                req.body.user=data
                next()
            }

        })
        .catch(err=>{
            //console.log(err)
            res.status(500).json("server error")
        })
        }catch(err){
            res.status(415).json("token incorrect")
        }
    }else{
        res.status(410).json("you need login")
    }

    
}

var CheckLoginForLogout=(req,res,next)=>{
    if(req.headers.token){
        try{
           
            let token=req.headers.token
            token=token.slice(1,token.length-1)
            let data=jwt.verify(token,'nghiango')
            Account.findById(data._id)
            .then(data=>{
            if(!data){
                res.status(410).json("you need login")
            }
            else {
                req.headers._id=data._id
                next()
            }

        })
        .catch(err=>{
            //console.log(err)
            res.status(500).json("server error")
        })
        }catch(err){
            res.status(415).json("token incorrect")
        }
    }else{
        res.status(410).json("you need login")
    }
    
}


var CheckLoginNoData=(req,res,next)=>{
    if(req.headers.token){
        try{
         
            let token=req.headers.token
            token=token.slice(1,token.length-1)
            let data=jwt.verify(token,'nghiango')
            console.log(data)
            Account.findById(data._id)
            .then(data=>{
            if(!data){
                res.status(410).json("you need login")
            }
            else {
                next()
            }

        })
        .catch(err=>{
            //console.log(err)
            res.status(500).json("server error")
        })
        }catch(err){
            res.status(415).json("token incorrect")
        }
    }else{
        res.status(410).json("you need login")
    }
}

module.exports = {CheckLoginHasData,CheckLoginNoData,CheckLoginForLogout}