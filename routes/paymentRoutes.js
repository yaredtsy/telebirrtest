const express = require("express");
const router = require("express-promise-router")();
const validation = require("../validation/paymentValidtor");

const PaymentController = require("../controllers/PaymentController");

/**
 * @param customerid customerName description amount merchantReference
 * @resp
 * @parma
 */
router.route("/createbill").post(validation.ValidatePaymentInput, PaymentController.CreateBill)
    /**
     * @param customerid customerName description amount merchantReference
     * @resp
     * @parma
     */
router.route("/checkbill/:id").get(PaymentController.CheckBill)
    /**
     * @param customerid customerName description amount merchantReference
     * @resp
     * @parma
     */
router.route("/getallbill/:userid").get(PaymentController.GetAllBill)
    /**
     * @param customerid customerName description amount merchantReference
     * @resp
     * @parma
     */
router.route("/deletebill/:id").get(PaymentController.DeleteBill)

router.route("/teset").post(PaymentController.Te)


module.exports = router;