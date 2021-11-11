const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayedSchema = new Schema({
    phone:{
        type:String,
        require:true
    },
    amount:{
        type:Number,
        require:true,
        default:0
    },
    code:{
        type:String,
        require:true,    
    },
    claimed:{
        type:Boolean,
        require:false,
    }
}, { timestamps: true });

const PaymentModel = mongoose.model("payed", PayedSchema);
module.exports = PaymentModel;

