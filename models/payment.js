const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    gameversion:{
        type:String,
        required:false
    },
    paymentcode: {
        type: String,
        required: true,
    },
    price:{
        type:String,
        required:true,
    },
    mType:{
        type:String,
        require:true,
    },
    mCartType:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,  
    },
    payed: {
        type: Boolean,
        required: true,
        default: false,
    },
    message: {
        type: String,
        required: true
    },
    received: {
        type: Boolean,
        required: true,
        default: false,
    },
    phonenumber:{
        type:String,
        required:false,
        
    },
    paymenttype:{
        type:String,
        enum:["WEBIRR","TELEBIRR","AIRTIME"],
        default:"WEBIRR"
    }
}, { timestamps: true });

const PaymentModel = mongoose.model("payment", paymentSchema);
module.exports = PaymentModel;