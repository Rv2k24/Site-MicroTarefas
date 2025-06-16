// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase-config'
import './style.css'



const app = createApp(App)  // Agora "app" é criado antes

app.use(router)
app.mount('#app')
