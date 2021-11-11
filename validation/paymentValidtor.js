const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = {
    ValidatePaymentInput: async(req, res, next) => {

        let data = req.body;
        console.log(data);
        let errors = {};

        data.customerCode = !isEmpty(data.customerCode) ? data.customerCode : "";
        data.customerName = !isEmpty(data.customerName) ? data.customerName : "";
        data.description = !isEmpty(data.description) ? data.description : "";
        data.amount = !isEmpty(data.amount) ? data.amount : "";
        data.merchantReference = !isEmpty(data.merchantReference) ? data.merchantReference : "";

        data.price = !isEmpty(data.price) ? data.price : "";
        data.mType = !isEmpty(data.mType) ? data.mType : "";
        data.mCartType = !isEmpty(data.mCartType) ? data.mCartType : "";


        if (Validator.isEmpty(data.customerCode)) {
            errors.customerCode = "customerCode field is required";
        }

        if (Validator.isEmpty(data.customerName)) {
            errors.customerName = "customerName field is required";
        }

        if (Validator.isEmpty(data.amount)) {
            errors.amount = "amount field is required";
        }

        if (Validator.isEmpty(data.merchantReference)) {
            errors.merchantReference = "merchantReference field is required";
        }

        if (Validator.isEmpty(data.price)) {
            errors.price = "price field is required";
        }

        if (Validator.isEmpty(data.mType)) {
            errors.mType = "mType field is required";
        }

        if (Validator.isEmpty(data.mCartType)) {
            errors.mCartType = "mCartType field is required";
        }

        if (!isEmpty(errors)) {
            console.log(errors);
            return res.status(400).json(errors);
        }

        next();
    },
    ValidateAirTime: async(req,res,next)=>{
        let data = req.body;
        console.log(data);
    }
}