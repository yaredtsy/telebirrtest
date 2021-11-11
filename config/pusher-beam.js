const PushNotifications = require('@pusher/push-notifications-server');

const  pushNotifications = new PushNotifications({
  instanceId: '611f30de-d8c9-4aea-8bca-b3826a434a66',
  secretKey: '27A0889F6062BB2797BB80307F5595E5816B27CC91E5A742C553BD285CF49851'
});


module.exports = {pushNotifications}


