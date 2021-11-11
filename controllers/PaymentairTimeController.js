const PaymentModel = require("../models/payment");
const PayedModel = require("../models/payds");
const PlayerModel = require("../models/player");

const crypto = require("crypto");
const querystring = require("query-string");

const { pusher } = require("../config/pusher");
const { pushNotifications } = require("../config/pusher-beam");

const avaliablephones = []
const lockedphones = []

module.exports = {
  CreateBill: async (req, res, next) => {
    const {
      customerCode,
      customerName,
      description,
      amount,
      merchantReference,

      price,
      mType,
      mCartType,
      gameversion,
      phone,
    } = req.body;
    try{
    const airtime = await PaymentModel.findOne({
      paymenttype: "AIRTIME",
      phone: phone,
      payed: payed,
    });

    if (airtime) {
      return res.json({
        success: false,
        error: BILL_EXISTS,
      });
    } else {
      paymentbill = PaymentModel({
        userID: customerCode,
        paymentcode: cryptoRandomString({ length: 6 }),
        message: description,
        price: price,
        mType: mType,
        amount: amount,
        mCartType: mCartType,
        gameversion: gameversion,
        phone: phone,
      });
      bill = await paymentbill.save();
      return res.json({
        success: true,
        paymentcode: bill.paymentcode,
        cbeBirrPaymenturl: config.cbeBirr,
        message: bill.message,
        price: bill.price,
        mType: bill.mType,
        amount: bill.amount,
        mCartType: bill.mCartType,
        phone: phone,
      });
    }
    }
    catch(error){
       return res.json(error).status(500) 
    }

  },
  PrepareSMsGateways: async(req,res,next)=>{
      const {phone} = req.body

      try{
        pushNotifications.publishToInterests(["servergateway"], {
            fcm: {
                notification: {
                  title: "Hello",
                  body: "Hello, world!",
                },
              },
        })
        res.json()
      }
      catch(error){

      }
  },
  RegisterActivePhone: async(req,res,next) => {
    
    const {phone} = req.body

    if(!avaliablephones.includes(phone)){
        if(avali)
        avaliablephones.push(phone)
    }

  },

  


};
