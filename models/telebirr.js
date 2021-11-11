const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TelebirrSchema = new Schema({
    price:{
        type: Number,
        required: true,
    },
    canceled:{
        type: Boolean,
        default: false,
    },
    paid:{
        type: Boolean,
        default: false,
    }
})

const telebirrmodel = mongoose.model("telebirr", TelebirrSchema);
module.exports = telebirrmodel;

