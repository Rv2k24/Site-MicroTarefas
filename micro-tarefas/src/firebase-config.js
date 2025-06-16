import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyB0CHiDonzbTYEWjGSbWIYsEVb0Kl4_5uM",
  authDomain: "sitemicrotarefas.firebaseapp.com",
  projectId: "sitemicrotarefas",
  storageBucket: "sitemicrotarefas.firebasestorage.app",
  messagingSenderId: "1026346149541",
  appId: "1:1026346149541:web:a546e1e91092835654cf4c",
  measurementId: "G-5PDKRD3HXJ"
}

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const messaging = getMessaging(app)

export { db, auth, messaging }