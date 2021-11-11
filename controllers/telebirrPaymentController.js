const crypto = require("crypto");

const { scrypt, createCipheriv, randomFill } = require("crypto");
const TelebirrModel = require("../models/telebirr")
const config = require("../config/default.json");
const rsa = require("node-rsa");
const request = require("request");

const Hash = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const encrypt = (stringA) => {
  return crypto.publicEncrypt(
    {
      key:
        "-----BEGIN PUBLIC KEY-----\n" +
        config.TBAPublicID +
        "\n-----END PUBLIC KEY-----",
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(stringA)
  );
};

module.exports = {
  teset: async (req, res, next) => {
    try {
      var keysize = 2048;
      const price = "5"
      var maxencrptblock = 117;
      var maxdecryptblock = keysize / maxencrptblock;
      var timestamp = Date.now()
      var outTradeNo = "20210907" + timestamp

      var parameters = {
        appId: config.TBAppID,
        appKey: config.TBAppKey,
        nonce: "f514260e911746b0" + timestamp,
        notifyUrl: "http://www.google.com/notifyUrl",
        outTradeNo: outTradeNo,
        receiveName: "kuku player",
        returnApp: {
          Schemes: "willOpenTelebirrPay",
          identifier: "com.ethio.telebirr",
        },
        returnUrl: "http://www.google.com/returnUrl",
        shortCode: config.TBShortID,
        subject: "kolo",
        timeoutExpress: 30,
        timestamp: timestamp,
        totalAmount: price,
      };
      var parametersnoAppkey = {
        appId: config.TBAppID,
        nonce: "f514260e911746b0" + timestamp,
        notifyUrl: "http://www.google.com/notifyUrl",
        outTradeNo: outTradeNo,
        receiveName: "kuku player",
        returnApp: {
          Schemes: "willOpenTelebirrPay",
          identifier: "com.ethio.telebirr",
        },
        returnUrl: "http://www.google.com/returnUrl",
        shortCode: config.TBShortID,
        subject: "kolo",
        timeoutExpress: "30",
        timestamp: timestamp,
        totalAmount: price,
      };
      var ussdjson = "";

      for (var k in parameters) {
        let stringify;
        if (typeof parameters[k] === "string")
          stringify = k + "=" + parameters[k] + "&";
        else if (typeof parameters[k] === "object")
          stringify = k + "=" + JSON.stringify(parameters[k]) + "&";
        else stringify = k + "=" + parameters[k].toString() + "&";

        ussdjson += stringify;
      }
      ussdjson = ussdjson.substring(0, ussdjson.length - 1);

      const stringA = JSON.stringify(parametersnoAppkey);

      var signature = Buffer.from("");
      var offset = 0;
      var inputLen = stringA.length;
      var data = "";
      var i = 0;

      while (inputLen - offset > 0) {
        if (inputLen - offset > maxencrptblock) {
          data = encrypt(stringA.substring(offset, offset + maxencrptblock));
        } else {
          data = encrypt(stringA.substring(offset, inputLen))
        }
        signature = Buffer.concat([signature, data]);
        i++;
        offset = i * maxencrptblock;
      }

      const sign = Hash(ussdjson);

      var Ussd = {
        appid: config.TBAppID,
        sign: sign,
        ussd: signature.toString("base64")
      };

      try {
        var body = await new Promise((resolve, reject) => {
          request.post(
            `http://196.188.120.3:11443/service-openup/toTradeSDKPay`,
            { json: Ussd },
            (error, response, body) => {
              if (!error && response.statusCode == 200) {
                resolve(body);
              } else reject(error);
            }
          );
        });
        
        
        return res.json({
          url:body.data.toPayUrl
        });

      } catch (error) {
        console.log(error);
      }


    } catch (error) {
      console.log(error);
      return res
        .json({
          error,
        })
        .status(500);
    }
  },
};
