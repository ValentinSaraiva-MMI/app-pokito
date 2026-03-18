import { io } from 'socket.io-client'

const socket = io('http://localhost:5015', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
})

socket.on('connect', () => {
  console.log('[Socket] Connecté:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('[Socket] Déconnecté:', reason)
})

socket.on('connect_error', (err) => {
  console.error('[Socket] Erreur de connexion:', err.message)
})

export default socket
