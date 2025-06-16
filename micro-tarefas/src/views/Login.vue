<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" required />

      <label for="password">Senha:</label>
      <input id="password" v-model="password" type="password" required />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p>
      Não tem conta?
      <router-link to="/cadastro">Cadastre-se aqui</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)
    const router = useRouter()
    const auth = getAuth()

    async function handleLogin() {
      error.value = null
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/tarefas')
      } catch (e) {
        if (e.code === 'auth/user-not-found') {
          error.value = 'Usuário não encontrado.'
        } else if (e.code === 'auth/wrong-password') {
          error.value = 'Senha incorreta.'
        } else if (e.code === 'auth/invalid-email') {
          error.value = 'Email inválido.'
        } else {
          error.value = 'Erro ao tentar logar: ' + e.message
        }
      }
    }

    return {
      email,
      password,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
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
  background-color: #1976d2;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
