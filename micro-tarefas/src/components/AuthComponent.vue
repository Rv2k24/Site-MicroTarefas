<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, error, signUp, signIn, logout } = useAuth()

const email = ref('')
const password = ref('')
const isLogin = ref(true)

const handleAuth = async () => {
  let loggedUser = null
  if (isLogin.value) {
    loggedUser = await signIn(email.value, password.value)
  } else {
    loggedUser = await signUp(email.value, password.value)
  }

  if (loggedUser) {
    router.push('/tarefas')
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}
</script>
