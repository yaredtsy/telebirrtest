const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const socket = require("./config/socket")
const {pusher} = require("./config/pusher")
const {pushNotifications} = require("./config/pusher-beam")

pushNotifications.publishToInterests(["hello"], {
    web: {
      notification: {
        title: "Hello",
        body: "Hello, world!",
        deep_link: "https://www.pusher.com",
      },
    },
  })
  .then((publishResponse) => {
    console.log("Just published:", publishResponse.publishId);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

// socket.StartServer()

connectDB();

const app = express();

//Middlewares
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://127.0.0.1:8080",
        credentials: true
    })
);

//Routes
// app.use("/user/", require("./routes/authRoutes"));
app.use('/payment/', require("./routes/paymentRoutes"));
app.use('/player/', require("./routes/playerRoutes"));
app.use('/telebirrpayment/',require("./routes/telebirrpaymentRoutes"));
app.use('/airtime/',require("./routes/airtimeRoute"));

// app.post("/pusher/auth", (req, res) => {
//     const socketId = req.body.socket_id;
//     const channel = req.body.channel_name;
//     // Primitive auth: the client self-identifies. In your production app,
//     // the client should provide a proof of identity, like a session cookie.
//     const user_id = req.cookies.user_id;
//     const presenceData = { user_id };
//     const auth = pusher.authenticate(socketId, channel, presenceData);
//     res.send(auth);
//   });

const port = process.env.PORT || 5000;
app.listen(port);
console.log("Server listening at " + port);


