const express = require("express");
const router = require("express-promise-router")();

const AirTimeController = require("../controllers/airtimeController");
const validation = require("../validation/paymentValidtor");


router.route("/makepayment").post(AirTimeController.MakePayment)

router.route("/creatbill").post(AirTimeController.CreateBill)

router.route("/checkpayment").post(AirTimeController.Checkpayment)

router.route("/createuser").get(AirTimeController.CreateTesetUser)

router.route("/checkbalnce").post(AirTimeController.GetUserAccout)

router.route("/teset").get(AirTimeController.Test)

router.route("/getuser").get(AirTimeController.GetUser)

module.exports = router;
