const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  totalamount: {
    type: Number,
    require: true,
    default: 0,
  },
});
//model create

const Usermodel = mongoose.model("player", playerSchema);
module.exports = Usermodel;
