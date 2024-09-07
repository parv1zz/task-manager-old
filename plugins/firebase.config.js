import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyAC54Z6gq_WAjZQevw8F88l1druJEgQoss",
  authDomain: "task-manager-tm.firebaseapp.com",
  projectId: "task-manager-tm",
  storageBucket: "task-manager-tm.appspot.com",
  messagingSenderId: "403677188720",
  appId: "1:403677188720:web:558c149db9b1dc07df5ab5"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)
getToken(messaging, { vapidKey: 'BBgvh0uNoGik27EGtUU6SxQQmxqtrfafm8QOfwolzBgns4U7t8_gMVbHlPSbkYpaX0FKh6e_jlda-RMA4Fzp9oA' })