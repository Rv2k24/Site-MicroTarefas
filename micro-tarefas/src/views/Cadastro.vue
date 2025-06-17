<template>
  <div class="auth-container">
    <h2>Cadastro</h2>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />

    <button @click="handleSignUp">Cadastrar</button>

    <p class="error" v-if="error">{{ error }}</p>

    <p>
      Já tem conta? 
      <router-link to="/login">Faça login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, error, signUp } = useAuth()

const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  await signUp(email.value, password.value)
}

// Redireciona se já estiver logado
watch(user, (newUser) => {
  if (newUser) router.push('/tarefas')
})
</script>

<style scoped>
.auth-container {
  max-width: 320px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input, button {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  cursor: pointer;
}
.error {
  color: red;
}
</style>
