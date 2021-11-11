const express = require("express");
const router = require("express-promise-router")();

const TeleBirrController = require("../controllers/telebirrPaymentController")

router.route('/teset').get(TeleBirrController.teset)

module.exports = router