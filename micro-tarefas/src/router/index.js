import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase-config'

import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import Tarefas from '../views/Tarefas.vue'

const routes = [
  {
    path: '/',
    redirect: '/tarefas'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro
  },
  {
    path: '/tarefas',
    name: 'Tarefas',
    component: Tarefas,
    meta: { requiresAuth: true } // 🔒 Rota protegida
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🚦 Verifica se a rota exige autenticação
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
