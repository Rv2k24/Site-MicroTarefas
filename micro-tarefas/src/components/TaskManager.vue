<template>
  <div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { db } from '../firebase-config'
import { 
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where 
} from 'firebase/firestore'

const props = defineProps({
  user: Object
})

const tasks = ref([])
const newTask = ref('')

// Função para carregar tarefas do usuário
const loadTasks = async () => {
  tasks.value = []
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', props.user.uid)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnap => {
    tasks.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

// Adiciona uma nova tarefa
const addTask = async () => {
  if (newTask.value.trim() === '') return

  await addDoc(collection(db, 'tasks'), {
    text: newTask.value,
    completed: false,
    userId: props.user.uid
  })
  newTask.value = ''
  await loadTasks()
}

// Marca ou desmarca como concluída
const toggleComplete = async (task) => {
  const taskRef = doc(db, 'tasks', task.id)
  await updateDoc(taskRef, {
    completed: !task.completed
  })
  await loadTasks()
}

// Deleta uma tarefa
const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id))
  await loadTasks()
}

// Recarrega as tarefas sempre que o componente montar ou o usuário mudar
onMounted(loadTasks)
watch(() => props.user, loadTasks)
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}
input {
  padding: 0.5rem;
  width: 70%;
}
button {
  margin-left: 0.5rem;
  padding: 0.5rem;
}
li {
  margin: 0.5rem 0;
}
</style>
