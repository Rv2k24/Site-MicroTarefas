import { ref } from 'vue'
import { auth } from '../firebase-config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const user = ref(null)
const error = ref(null)

onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
})

function parseFirebaseError(err) {
  const code = err.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.'
    case 'auth/invalid-email':
      return 'Email inválido.'
    case 'auth/user-not-found':
      return 'Usuário não encontrado.'
    case 'auth/wrong-password':
      return 'Senha incorreta.'
    case 'auth/weak-password':
      return 'Senha muito fraca. Use ao menos 6 caracteres.'
    default:
      return err.message || 'Erro desconhecido.'
  }
}

export function useAuth() {
  const signUp = async (email, password) => {
    error.value = null
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      user.value = cred.user
      return cred.user
    } catch (err) {
      error.value = parseFirebaseError(err)
      return null
    }
  }

  const signIn = async (email, password) => {
    error.value = null
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      user.value = cred.user
      return cred.user
    } catch (err) {
      error.value = parseFirebaseError(err)
      return null
    }
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  return { user, error, signUp, signIn, logout }
}
