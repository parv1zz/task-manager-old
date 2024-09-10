import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

export default defineNuxtPlugin(nuxtApp => {
  const firebaseConfig = {
    apiKey: "AIzaSyAC54Z6gq_WAjZQevw8F88l1druJEgQoss",
    authDomain: "task-manager-tm.firebaseapp.com",
    projectId: "task-manager-tm",
    storageBucket: "task-manager-tm.appspot.com",
    messagingSenderId: "403677188720",
    appId: "1:403677188720:web:558c149db9b1dc07df5ab5"
  }
  
  const app = initializeApp(firebaseConfig)

  if(process.client) {
    const messaging = getMessaging(app)
    const token = getToken(messaging, { vapidKey: 'BJVV0i6wUJp8rm6ErVdhWI8M-p7YLsciSw7A_BH_xE2ab22_YEMamWJdc6-D0gyLt6Og9u78utZsDp7CpzZUtao' }).then((currentToken) => {
      if (currentToken) {
        nuxtApp.vueApp.provide('token', currentToken)
        nuxtApp.provide('token', currentToken)
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.error('An error occurred while retrieving token. ', err)
    })

    nuxtApp.vueApp.provide('messaging', messaging)
    nuxtApp.provide('messaging', messaging)
  }
})