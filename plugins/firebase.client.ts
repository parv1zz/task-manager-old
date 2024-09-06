import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: "AIzaSyAC54Z6gq_WAjZQevw8F88l1druJEgQoss",
    authDomain: "task-manager-tm.firebaseapp.com",
    projectId: "task-manager-tm",
    storageBucket: "task-manager-tm.appspot.com",
    messagingSenderId: "403677188720",
    appId: "1:403677188720:web:558c149db9b1dc07df5ab5"
  }

  const app = initializeApp(firebaseConfig)

  const auth = getAuth(app)
  const firestore = getFirestore(app)

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('firestore', firestore)
  nuxtApp.provide('firestore', firestore)
})