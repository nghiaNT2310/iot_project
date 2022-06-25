const Account=require('../models/Account')
var CheckLoginHasData=(req,res,next)=>{
    Account.findById(req.session.userid)
    .then(data=>{
        if(!data){
            res.json("you need login")
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
}

var CheckLoginNoData=(req,res,next)=>{
    Account.findById(req.session.userid)
    .then(data=>{
        if(!data){
            res.json("you need login")
        }
        else {
            next()
        }

    })
    .catch(err=>{
        //console.log(err)
        res.status(500).json("server error")
    })
}

module.exports = {CheckLoginHasData,CheckLoginNoData}