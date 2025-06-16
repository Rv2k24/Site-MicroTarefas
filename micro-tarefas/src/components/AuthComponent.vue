<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const isLogin = ref(true)

const auth = getAuth()

const handleAuth = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      alert('Login realizado com sucesso!')
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      alert('Cadastro realizado com sucesso!')
    }
  } catch (error) {
    alert('Erro: ' + error.message)
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Cadastro' }}</h2>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Senha" />
    <button @click="handleAuth">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
    <p @click="isLogin = !isLogin" style="cursor: pointer; color: blue">
      {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login' }}
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
input {
  padding: 0.5rem;
  width: 200px;
}
button {
  padding: 0.5rem 1rem;
}
</style>



