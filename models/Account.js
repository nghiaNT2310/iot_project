const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const bcrypt=require('bcrypt')

const accountSchema=new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: Number,
    },
    name:{
        type: String,
        default: ""
    },
    age:{
        type:Number
    },
    weight:{
        type:Number
    },
    height:{
        type: Number
    }
})

accountSchema.pre('save',function(next){
    const account=this
    bcrypt.hash(account.password,10,(err,hash)=>{
        account.password=hash
        next()
    })
})

const AccountModel=mongoose.model('account',accountSchema);
module.exports=AccountModel