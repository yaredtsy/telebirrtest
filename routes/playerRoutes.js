const express = require("express");
const router = require("express-promise-router")();

const PlayerController = require("../controllers/PlayerController")


router.route('/registerUser/').post(PlayerController.RegisterUser)

router.route('/isunique').post(PlayerController.IsUnique)

module.exports = router