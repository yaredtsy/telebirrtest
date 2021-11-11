const PaymentModel = require("../models/payment");
const PayedModel = require("../models/payds");
const PlayerModel = require("../models/player");

const crypto = require('crypto')
const querystring = require("query-string");

const {pusher} = require('../config/pusher')
const { pushNotifications } = require('../config/pusher-beam')


const {
  BILL_EXISTS,
  BILL_NOT_PAID,
  INTERNAL_SERVER_ERROR,
  NO_BILL_FOUND,
  PAYMENT_CODE_NOT_FOUND,
  SOMETHING_IS_WRONG,
  CLAIMED,
  USER_ID_NOT_FOUND,
} = require("../config/errors");

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
  },

  MakePayment: async (req, res, next) => {
    const { phonenumber, amount } = req.body;
    console.log(req.body);

    Payed = PayedModel({
      phone: phonenumber,
      amount: amount,
      code: crypto.randomBytes(7).toString('hex'),
    });

    airtime = await Payed.save();
    
    
    return res.json({
      success: true,
      airtime,
      amount
    });
  },

  Checkpayment: async (req, res, next) => {
    const { code, playerid } = req.body;
    payed = await PayedModel.findOne({ code: code });
    player = await PlayerModel.findOne({ userId: playerid });

    if (!player)
      return res.json({
        success: false,
        message: USER_ID,
      });

    if (payed) {
      if (payed.claimed) {
        return res.json({
          success: false,
          message: CLAIMED,
        });
      }
      player.totalamount =parseInt( player.totalamount)+ parseInt(payed.amount);
      console.log("payed "+player.totalamount);
      await player.save();

      payed.claimed = true;
      await payed.save();

      return res.json({
        success: true,
      });

    } else {

      return res.json({
        success: false,
        message: NO_BILL_FOUND,
      });

    }
  },

  CreateTesetUser:async(req,res,next)=>{
    player = PlayerModel({
        userId:123456,
    })

    user = await player.save()

    return res.json({
        user
    });


  },

  GetUserAccout:async(req,res,next) =>{
    const {playerid} = req.body
    player = await PlayerModel.findOne({userId:playerid})
    if(player)
      return res.json({
          player
      })
    else
      return res.json({
        USER_ID_NOT_FOUND
      })
  },

  Test:async(req,res,next) =>{
    try{
      //  pusher.trigger("my-channel", "my-event", {
      //   message: "Hello Yared"
      // }).catch((e)=>console.log(e));

      // pushNotifications.publishToInterests

      res.json({
        success:"little do u kow"
      })
    }
    catch(error){
      console.log(error)
      res.json(error).status(500)
    }
  },
  GetUser:async(req,res,next) =>{
    try{
      var socketId = req.body.socket_id;
      var channel = req.body.channel_name;

      var presenceData = {
        user_id: 'unique_user_id',
        user_info: {
          name: 'Mr Pusher',
          twitter_id: '@pusher'
        }
      };
      var auth = pusher.auth( socketId, channel, presenceData );

      pusher.get({ path: "/channels/my-channel/users" }).then((result)=>{
        res.json({
          auth:auth,
          result:result
        })
      }).catch((e)=>console.log(e));

     
    }
    catch(error){
    
      res.json(error).status(500)
    }
  },
};
