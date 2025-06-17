<template>
  <div class="tasks-container">
    <h2>Suas Tarefas</h2>

    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="Nova tarefa" />
      <button type="submit">Adicionar</button>
    </form>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">
          {{ task.text }}
        </span>
        <button @click="toggleComplete(task)">✓</button>
        <button @click="deleteTask(task.id)">🗑️</button>
      </li>
    </ul>

    <button @click="logout">Sair</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { db } from '../firebase-config'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'

const router = useRouter()
const { user, logout } = useAuth()

const tasks = ref([])
const newTask = ref('')

const loadTasks = async () => {
  if (!user.value) return
  tasks.value = []
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', user.value.uid)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnap => {
    tasks.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

const addTask = async () => {
  if (newTask.value.trim() === '') return
  await addDoc(collection(db, 'tasks'), {
    text: newTask.value,
    completed: false,
    userId: user.value.uid
  })
  newTask.value = ''
  await loadTasks()
}

const toggleComplete = async (task) => {
  const taskRef = doc(db, 'tasks', task.id)
  await updateDoc(taskRef, { completed: !task.completed })
  await loadTasks()
}

const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id))
  await loadTasks()
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Carrega tarefas quando componente monta e se usuário mudar
onMounted(loadTasks)
watch(user, (newUser) => {
  if (newUser) {
    loadTasks()
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.tasks-container {
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex-grow: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
li span {
  flex-grow: 1;
}
</style>
