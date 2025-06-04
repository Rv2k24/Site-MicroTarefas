<template>
<div id="app">
<AuthComponent v-if="!user" @login="handleLogin" />
<TaskManager v-else :user="user" @logout="handleLogout" />
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AuthComponent from './components/AuthComponent.vue';
import TaskManager from './components/TaskManager.vue';

const firebaseConfig = {
apiKey: 'SUA_API_KEY',
authDomain: 'SEU_DOMINIO.firebaseapp.com',
projectId: 'SEU_PROJETO_ID',
storageBucket: 'SEU_BUCKET.appspot.com',
messagingSenderId: 'SEU_MESSAGING_ID',
appId: 'SEU_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const user = ref(null);

onMounted(() => {
onAuthStateChanged(auth, (u) => {
user.value = u;
});
});

function handleLogin(u) {
user.value = u;
}

function handleLogout() {
signOut(auth);
user.value = null;
}
</script>

<style>
body {
font-family: Arial, sans-serif;
}
</style>
