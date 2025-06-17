<template>
  <div>
    <h2>Login ou Cadastro</h2>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />

    <button @click="handleSignIn">Entrar</button>
    <button @click="handleSignUp">Cadastrar</button>

    <p style="color: red" v-if="error">{{ error }}</p>

    <button v-if="user" @click="logout">Sair</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'    // importar router
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, error, signUp, signIn, logout } = useAuth()

const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  const newUser = await signUp(email.value, password.value)
  if (newUser) {
    router.push('/tarefas')              // redireciona após cadastro
  }
}

const handleSignIn = async () => {
  const loggedUser = await signIn(email.value, password.value)
  if (loggedUser) {
    router.push('/tarefas')              // redireciona após login
  }
}
</script>
