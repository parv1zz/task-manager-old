importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyAC54Z6gq_WAjZQevw8F88l1druJEgQoss",
  authDomain: "task-manager-tm.firebaseapp.com",
  projectId: "task-manager-tm",
  storageBucket: "task-manager-tm.appspot.com",
  messagingSenderId: "403677188720",
  appId: "1:403677188720:web:558c149db9b1dc07df5ab5"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload)
})