import { defineStore } from 'pinia'
import { ref } from 'vue'
import socket from '@/composables/useSocket'

export const useUserStore = defineStore('user', () => {
  // ─── State ───
  const pseudo = ref('')
  const avatar = ref('')
  const socketId = ref('')
  const tableId = ref('')
  const tableCode = ref('')

  // ─── Actions ───
  function joinAsGuest(name, avatarUrl) {
    return new Promise((resolve, reject) => {
      socket.emit('guest:join', { pseudo: name, avatar: avatarUrl })

      socket.once('guest:joined', (data) => {
        pseudo.value = data.pseudo
        avatar.value = data.avatar
        socketId.value = data.socketId
        resolve(data)
      })

      socket.once('guest:error', (data) => {
        reject(new Error(data.message))
      })
    })
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
    pseudo.value = ''
    avatar.value = ''
    socketId.value = ''
    tableId.value = ''
    tableCode.value = ''
  }

  return {
    pseudo,
    avatar,
    socketId,
    tableId,
    tableCode,
    joinAsGuest,
    joinTable,
    createTable,
    reset
  }
})
