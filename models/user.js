const mongoose = require('mongoose');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        require : true,
    },
    salt : {
        type : String,
    },
    role : {
       type : String, 
       enum : ['USER', 'ADMIN'],
       default : 'USER'
    },
    profileImageUrl :{
        type : String,
        default : "/images/default.jpg"
    },
    resetOtp : {
        type : String
    },
    otpExpireTime: {
        type : Date
    }

},{timestamps : true})

userSchema.pre('save', function (next){
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = crypto.randomBytes(16).toString();
    const hashedPassword = crypto.createHash('sha256', salt).update(user.password).digest('hex')

    user.salt = salt
    user.password = hashedPassword

    next();
})

const User = mongoose.model('BlogUser', userSchema)


module.exports = User;