<template>
  <div class="tarefas-container">
    <h2>Suas Tarefas</h2>

    <form @submit.prevent="adicionarTarefa">
      <input
        v-model="novaTarefa"
        placeholder="Digite uma nova tarefa"
        required
        maxlength="100"
      />
      <button type="submit">Adicionar</button>
    </form>

    <ul v-if="tarefas.length">
      <li
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :class="{ concluida: tarefa.concluida }"
      >
        <label>
          <input
            type="checkbox"
            v-model="tarefa.concluida"
            @change="atualizarTarefa(tarefa)"
          />
          {{ tarefa.texto }}
        </label>
        <button @click="removerTarefa(tarefa.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhuma tarefa ainda.</p>

    <button @click="handleLogout" class="logout-btn">Sair</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore'

import { db } from '../firebase-config'

export default {
  setup() {
    const auth = getAuth()
    const router = useRouter()
    const usuario = auth.currentUser

    const novaTarefa = ref('')
    const tarefas = ref([])

    if (!usuario) {
      router.push('/login')
    }

    const tarefasCollection = collection(db, 'tarefas')

    // Buscar tarefas do usuário atual e escutar atualizações em tempo real
    onMounted(() => {
      const q = query(
        tarefasCollection,
        where('uid', '==', usuario.uid),
        orderBy('createdAt', 'desc')
      )

      onSnapshot(q, (querySnapshot) => {
        const lista = []
        querySnapshot.forEach(docSnap => {
          lista.push({ id: docSnap.id, ...docSnap.data() })
        })
        tarefas.value = lista
      })
    })

    async function adicionarTarefa() {
      if (!novaTarefa.value.trim()) return

      await addDoc(tarefasCollection, {
        texto: novaTarefa.value.trim(),
        concluida: false,
        uid: usuario.uid,
        createdAt: new Date()
      })

      novaTarefa.value = ''
    }

    async function atualizarTarefa(tarefa) {
      const tarefaDoc = doc(db, 'tarefas', tarefa.id)
      await updateDoc(tarefaDoc, {
        concluida: tarefa.concluida
      })
    }

    async function removerTarefa(id) {
      const tarefaDoc = doc(db, 'tarefas', id)
      await deleteDoc(tarefaDoc)
    }

    async function handleLogout() {
      try {
        await signOut(auth)
        router.push('/login')
      } catch (e) {
        alert('Erro ao sair: ' + e.message)
      }
    }

    return {
      novaTarefa,
      tarefas,
      adicionarTarefa,
      atualizarTarefa,
      removerTarefa,
      handleLogout
    }
  }
}
</script>

<style scoped>
.tarefas-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

form {
  display: flex;
  gap: 0.5rem;
}

input[type='text'],
input[type='email'],
input[type='password'],
input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #1565c0;
}

ul {
  list-style: none;
  padding-left: 0;
  margin-top: 1rem;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #ddd;
}

li.concluida label {
  text-decoration: line-through;
  color: #888;
}

li label {
  cursor: pointer;
  flex: 1;
}

li button {
  background-color: #d32f2f;
  margin-left: 1rem;
}

li button:hover {
  background-color: #b71c1c;
}

.logout-btn {
  margin-top: 2rem;
  background-color: #d32f2f;
  width: 100%;
}

.logout-btn:hover {
  background-color: #b71c1c;
}
</style>
