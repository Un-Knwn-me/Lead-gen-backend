const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config();

const leadSchema = new mongoose.Schema({
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
    mobile:{
        type: Number,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    token:{
        type: String,
        default: ''
    },
    role:{
        type: String,
        default: "lead"
    },
    status:{
        type: String,
        default: "Incomming"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
}, {versionKey: false, collection:"leads"})

const LeadModel = mongoose.model('leads', leadSchema)
module.exports = {LeadModel};