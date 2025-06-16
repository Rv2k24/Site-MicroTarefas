<!-- src/views/Cadastro.vue -->
<template>
  <div class="cadastro-container">
    <h2>Cadastro</h2>
    <form @submit.prevent="handleCadastro">
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" required />

      <label for="password">Senha:</label>
      <input id="password" v-model="password" type="password" required minlength="6" />

      <button type="submit">Criar Conta</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <p>
      Já tem conta?
      <router-link to="/login">Faça login aqui</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)
    const success = ref(null)
    const router = useRouter()
    const auth = getAuth()

    async function handleCadastro() {
      error.value = null
      success.value = null

      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        success.value = 'Conta criada com sucesso! Redirecionando para login...'

        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (e) {
        if (e.code === 'auth/email-already-in-use') {
          error.value = 'Este email já está em uso.'
        } else if (e.code === 'auth/invalid-email') {
          error.value = 'Email inválido.'
        } else if (e.code === 'auth/weak-password') {
          error.value = 'Senha muito fraca. Use no mínimo 6 caracteres.'
        } else {
          error.value = 'Erro ao criar conta: ' + e.message
        }
      }
    }

    return {
      email,
      password,
      error,
      success,
      handleCadastro
    }
  }
}
</script>

<style scoped>
.cadastro-container {
  max-width: 320px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  margin-top: 1rem;
}

input {
  width: 100%;
  padding: 0.4rem;
  margin-top: 0.2rem;
  box-sizing: border-box;
}

button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.6rem;
  background-color: #388e3c;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #2e7d32;
}

.error {
  color: red;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}
</style>
