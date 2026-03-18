import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket from '@/composables/useSocket'

export const useUserStore = defineStore('user', () => {
  // ─── State ───
  const id = ref(null)
  const email = ref('')
  const pseudo = ref('')
  const phone = ref('')
  const birthdate = ref('')
  const avatar = ref('')
  const skin_cartes = ref('')
  const isGuest = ref(true)
  
  const socketId = ref('')
  const tableId = ref('')
  const tableCode = ref('')

  const isLoggedIn = computed(() => !!pseudo.value)

  // ─── Actions HTTP API ───

  async function registerUser(payload) {
    const res = await fetch('http://localhost:5015/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Erreur d'inscription")
    }
    
    // Succès
    id.value = data.id
    email.value = data.email
    pseudo.value = data.pseudo
    phone.value = data.phone || ''
    birthdate.value = data.birthdate || ''
    avatar.value = data.avatar || ''
    skin_cartes.value = data.skin_cartes || ''
    isGuest.value = false

    // Attacher à la socket (on réutilise l'event existant pour l'instant)
    await attachToSocket(data.pseudo, data.avatar)

    return data
  }

  async function loginUser(emailInput, password) {
    const res = await fetch('http://localhost:5015/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Erreur de connexion')
    }

    id.value = data.id
    email.value = data.email
    pseudo.value = data.pseudo
    phone.value = data.phone || ''
    birthdate.value = data.birthdate || ''
    avatar.value = data.avatar || ''
    skin_cartes.value = data.skin_cartes || ''
    isGuest.value = false

    await attachToSocket(data.pseudo, data.avatar)

    return data
  }

  // ─── Actions Sockets ───

  function attachToSocket(name, avatarUrl) {
    return new Promise((resolve, reject) => {
      socket.emit('guest:join', { pseudo: name, avatar: avatarUrl })

      socket.once('guest:joined', (data) => {
        socketId.value = data.socketId
        resolve(data)
      })

      socket.once('guest:error', (data) => {
        reject(new Error(data.message))
      })
    })
  }

  function joinAsGuest(name, avatarUrl) {
    isGuest.value = true
    pseudo.value = name
    avatar.value = avatarUrl
    return attachToSocket(name, avatarUrl)
  }

  function joinTable(code) {
    return new Promise((resolve, reject) => {
      socket.emit('table:join', { code })

      socket.once('table:joined', (data) => {
        tableId.value = data.table?.id || data.tableId || ''
        tableCode.value = code
        resolve(data)
      })

      socket.once('table:error', (data) => {
        reject(new Error(data.message))
      })
    })
  }

  function createTable() {
    return new Promise((resolve, reject) => {
      socket.emit('table:create', { type: 'publique', joueursMax: 6 })

      socket.once('table:created', (data) => {
        tableId.value = data.table?.id || data.tableId || ''
        tableCode.value = data.table?.code || data.code || ''
        resolve(data)
      })

      socket.once('table:error', (data) => {
        reject(new Error(data.message))
      })
    })
  }

  function reset() {
    id.value = null
    email.value = ''
    pseudo.value = ''
    phone.value = ''
    birthdate.value = ''
    avatar.value = ''
    skin_cartes.value = ''
    isGuest.value = true
    socketId.value = ''
    tableId.value = ''
    tableCode.value = ''
  }

  return {
    id,
    email,
    pseudo,
    phone,
    birthdate,
    avatar,
    skin_cartes,
    isGuest,
    socketId,
    tableId,
    tableCode,
    isLoggedIn,
    registerUser,
    loginUser,
    joinAsGuest,
    joinTable,
    createTable,
    reset
  }
})
