import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: () => import('@/views/LobbyView.vue'),
    beforeEnter: () => {
      const user = useUserStore()
      if (!user.pseudo) return { name: 'Home' }
    }
  },
  {
    path: '/waiting/:tableId',
    name: 'WaitingRoom',
    component: () => import('@/views/WaitingRoomView.vue'),
    beforeEnter: () => {
      const user = useUserStore()
      if (!user.tableId) return { name: 'Lobby' }
    }
  },
  {
    path: '/game/:tableId',
    name: 'Game',
    component: () => import('@/views/GameView.vue'),
    beforeEnter: () => {
      const user = useUserStore()
      if (!user.tableId) return { name: 'Home' }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
