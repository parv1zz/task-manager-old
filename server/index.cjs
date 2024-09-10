var admin = require("firebase-admin")

var serviceAccount = require("./service-account-file.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-manager-tm-default-rtdb.firebaseio.com"
})

const messaging = admin.messaging()

const registrationToken = 'dxbsOt4OTUePIpS71XYeXu:APA91bHOYQJV1i7Z_hHRaHMxb-wmqT0fj6PFXaDNozrUEY_2AYqmtJ_AkQDNbyfMo9sWttGeK40yWIIlu4jvpnRLlb5Xfbp4T-QPlCpp7IYCSmjDjxnHoBrVpLYc1-mCRrflOFFdH5aE'
const message = {
  notification: {
    title: 'Hellooooo',
    body: 'Its meeee'
  },
  token: registrationToken
}

messaging.send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response)
  })
  .catch((error) => {
    console.log('Error sending message:', error)
  })