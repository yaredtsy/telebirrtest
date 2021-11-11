const { ValidationError } = require("mongoose");
const Pusher = require("pusher")
const config = require("./default.json")

const pusher = new Pusher({
    appId: "1264327",
    key: "46564a936f50d6cde776",
    secret: "d8f74d7f951ffb610c3c",
    cluster: "ap2",
    useTLS: true
  });
pusher
  .get({
    path: "/channels",
    params: { filter_by_prefix: "presence-" },
  })
  .then((response) => {
    console.log(`received response with status ${response.status}`)


    return response.text().then((body) => {
      console.log(`and body ${body}`)
    })
  })
  .catch((err) => {
    console.log(`received error ${err}`)
  })
const authResponse = pusher.authenticate(
    "123.456",
    "presence-channel",
    {
      user_id: "foo",
      user_info: { bar: 42 },
    }
  )
module.exports={ pusher};