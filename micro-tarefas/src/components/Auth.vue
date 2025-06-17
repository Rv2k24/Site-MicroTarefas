<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Cadastro' }}</h2>
    
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />
    
    <button @click="handleAuth">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
    
    <p @click="toggleMode" class="toggle">
      {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login' }}
    </p>

    <p v-if="error" class="error">{{ error }}</p>

    <button v-if="user" @click="logout">Sair</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user, error, signUp, signIn, logout } = useAuth()

const email = ref('')
const password = ref('')
const isLogin = ref(true)

const handleAuth = async () => {
  if (isLogin.value) {
    await signIn(email.value, password.value)
  } else {
    await signUp(email.value, password.value)
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}
</script>

<style scoped>
.auth-container {
  max-width: 300px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
.toggle {
  color: blue;
  cursor: pointer;
  user-select: none;
}
.error {
  color: red;
}
</style>
