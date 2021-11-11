const PaymentModel = require("../models/payment");
const querystring = require("query-string");
const request = require("request");
const config = require("../config/default.json");
const socket = require('../config/socket')


const {
    BILL_EXISTS,
    BILL_NOT_PAID,
    INTERNAL_SERVER_ERROR,
    NO_BILL_FOUND,
    PAYMENT_CODE_NOT_FOUND,
    SOMETHING_IS_WRONG
} = require("../config/errors")


module.exports = {
    CreateBill: async(req, res, next) => {

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
        } = req.body;

        const date = new Date();

        const formattedDate =
            date.getFullYear() +
            "-" +
            date.getMonth() +
            "-" +
            date.getDate() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes();

        const data = {
            customerCode: customerCode,
            customerName: customerName,
            time: formattedDate,
            description: description,
            amount: price,
            merchantReference: merchantReference,
            merchantId: config.merchantId,
        };

        var payments = await PaymentModel.exists({ userID: customerCode, payed: false })
        console.log(payments);
        try {
            if (!payments) {
                var body = await new Promise((resolve, reject) => {
                    request.post(
                        `${config.Url}/einvoice/api/postbill?api_key=` +
                        config.api_key, { json: data },
                        (error, response, body) => {
                            if (!error && response.statusCode == 200) {
                                resolve(body);
                            } else reject(error);
                        }
                    );
                });

                paymentbill = PaymentModel({
                    userID: customerCode,
                    paymentcode: body.res,
                    message: description,
                    price: price,
                    mType: mType,
                    amount: amount,
                    mCartType: mCartType,
                    gameversion:gameversion,
                });
                bill = await paymentbill.save();

                return res.json({
                    success: true,
                    paymentcode: bill.paymentcode,
                    cbeBirrPaymenturl:config.cbeBirr,
                    message: bill.message,
                    price: bill.price,
                    mType: bill.mType,
                    amount: bill.amount,
                    mCartType: bill.mCartType,
                });

            } else {
                res.json({
                    success: false,
                    error: BILL_EXISTS
                })
            }
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                error: INTERNAL_SERVER_ERROR
            }).status(500)
        }

    },
    CheckBill: async(req, res, next) => {

        const { id } = req.params

        var payment = await PaymentModel.findOne({ paymentcode: id.trim(), payed: false })
        var formatedcode = id.replace(/\s+/g, "")
        var tesetCode = "647830118";

        try {
            if (payment) {
                var body = await new Promise((resolve, reject) => {
                    request.get(
                        `${config.Url}/einvoice/api/GetPaymentStatus?api_key=` +
                        config.api_key + '&wbc_code=' + formatedcode,
                        (error, response, body) => {
                            if (!error && response.statusCode == 200) {
                                resolve(body);
                            } else reject(error);
                        }
                    );
                });

                var data = JSON.parse(body)
                if (data.res)
                    if (data.res.status == 2) {
                        if (payment.payed == false) {
                            payment.payed = true;
                            await payment.save()
                            return res.json({
                                success: true,
                                paymentcode: bill.paymentcode,
                                message: bill.message,
                                price: bill.price,
                                mType: bill.mType,
                                amount: bill.amount,
                                mCartType: bill.mCartType,
                                cbeBirrPaymenturl:config.cbeBirr,
                            })
                        }
                    }
                return res.json({
                    success: false,
                    error: BILL_NOT_PAID
                })
                
            } else
                res.json({
                    success: false,
                    error: PAYMENT_CODE_NOT_FOUND
                })
        } catch (error) {

            return res.json({
                success: false,
                error: INTERNAL_SERVER_ERROR
            }).status(500)
        }
    },
    ClaimReward: async(req, res, next) => {
        const { id } = req.params
        var payment = await PaymentModel.findOne({ paymentcode: id.trim(), payed: true, received: false })
        try {
            if (payment) {
                payment.received = true
                await payment.save()

                return res.json({
                    success: true,
                    payment
                })
            } else {
                return res.json({
                    success: false,
                    error: PAYMENT_CODE_NOT_FOUND
                })
            }
        } catch (error) {
            res.json({
                success: false,
                error: INTERNAL_SERVER_ERROR
            }).status(500)
        }
    },
    GetAllBill: async(req, res, next) => {
        try {
            const { userid } = req.params


            payments = await PaymentModel.findOne({ userID: userid, payed: false })
            if (payments)
                return res.json({
                    success: true,
                    paymentcode: payments.paymentcode,
                    message: payments.description,
                    price: payments.price,
                    mType: payments.mType,
                    amount: payments.amount,
                    mCartType: payments.mCartType,
                    cbeBirrPaymenturl:config.cbeBirr,
                })
            else
                return res.json({
                    success: false,
                    error: NO_BILL_FOUND
                })

        } catch (error) {
            console.log(error);
            res.json({
                success: false,
                error: INTERNAL_SERVER_ERROR
            }).status(500)
        }
    },

    DeleteBill: async(req, res, next) => {
        const { id } = req.params
        var payment = await PaymentModel.findOne({ paymentcode: id.trim(), payed: false })

        try {
            if (payment) {
                const { id } = req.params
                const formtedId = id.replace(/\s+/g, "")

                var body = await new Promise((resolve, reject) => {
                    request.put(
                        `${config.Url}/einvoice/api/deletebill?api_key=` +
                        config.api_key + '&wbc_code=' + formtedId,
                        (error, response, body) => {
                            if (!error && response.statusCode == 200) {
                                resolve(body);
                            } else reject(error);
                        }
                    );
                });
                var data = JSON.parse(body)
                if (data.res == "Ok") {
                    var respo = await payment.remove()

                    return res.json({
                        success: true,
                    })
                }
                return res.json({
                    success: false,
                    error: SOMETHING_IS_WRONG
                })
            } else {
                return res.json({
                    success: false,
                    error: PAYMENT_CODE_NOT_FOUND
                })
            }
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                error: INTERNAL_SERVER_ERROR
            }).status(500)
        }
    },
    Te : async(req, res, next) => {
        console.log(req.body);
    }
};