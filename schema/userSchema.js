const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate:(value)=>validator.isEmail(value)
    },
    password:{
        type: String,
        required: true
    },
    token:{
        type: String,
        default: ''
    },
    role:{
        type: String,
        default: "salesRep"
    },
    status:{
        type: String,
        default: "Y"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
}, {versionKey: false, collection:"user_details"})

const UserModel = mongoose.model('user_details', userSchema)
module.exports = {UserModel};