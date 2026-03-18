import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket from '@/composables/useSocket'
import { useUserStore } from './userStore'

export const useGameStore = defineStore('game', () => {
  // ─── State ───
  const game = ref(null)
  const myCards = ref([])
  const notification = ref('')
  const winners = ref([])
  const error = ref('')
  const players = ref([])      // liste salle d'attente (table:players)
  const listenersReady = ref(false)

  // ─── Getters ───
  const userStore = useUserStore()

  const myPlayer = computed(() => {
    if (!game.value?.players) return null
    return game.value.players.find(p => p.pseudo === userStore.pseudo) || null
  })

  const myCurrentBet = computed(() => myPlayer.value?.bet ?? 0)

  const isMyTurn = computed(() => {
    return game.value?.currentPlayer === userStore.pseudo
  })

  const otherPlayers = computed(() => {
    if (!game.value?.players) return []
    return game.value.players.filter(p => p.pseudo !== userStore.pseudo)
  })

  /** Cartes du joueur local avec fusion game:hand */
  const mergedMyCards = computed(() => {
    if (myCards.value.length > 0) return myCards.value
    if (myPlayer.value?.cards) return myPlayer.value.cards
    return []
  })

  const stageLabel = computed(() => {
    const map = {
      ante: 'Ante',
      street1: 'Tour 1',
      street2: 'Tour 2',
      street3: 'Tour 3',
      street4: 'Tour 4 (River)',
      showdown: 'Abattage',
      finished: 'Terminé'
    }
    return map[game.value?.stage] || game.value?.stage || ''
  })

  // ─── Actions ───
  function initListeners() {
    if (listenersReady.value) return
    listenersReady.value = true

    socket.on('game:state', (state) => {
      game.value = state
    })

    socket.on('game:hand', (data) => {
      myCards.value = data.cards || []
    })

    socket.on('game:notification', (data) => {
      notification.value = data.message || ''
      setTimeout(() => { notification.value = '' }, 3000)
    })

    socket.on('game:error', (data) => {
      error.value = data.message || ''
      setTimeout(() => { error.value = '' }, 3000)
    })

    socket.on('game:finished', (data) => {
      winners.value = data.winners || []
    })

    socket.on('table:players', (data) => {
      players.value = data.players || data || []
    })
  }

  function startGame(tableId) {
    socket.emit('game:start', { tableId })
  }

  function sendAction(action, amount) {
    const payload = {
      tableId: userStore.tableId,
      action
    }
    if (amount !== undefined && amount !== null) {
      payload.amount = amount
    }
    socket.emit('game:action', payload)
  }

  function resetGame() {
    game.value = null
    myCards.value = []
    notification.value = ''
    winners.value = []
    error.value = ''
  }

  function removeListeners() {
    socket.off('game:state')
    socket.off('game:hand')
    socket.off('game:notification')
    socket.off('game:error')
    socket.off('game:finished')
    socket.off('table:players')
    listenersReady.value = false
  }

  return {
    // state
    game,
    myCards,
    notification,
    winners,
    error,
    players,
    // getters
    myPlayer,
    myCurrentBet,
    isMyTurn,
    otherPlayers,
    mergedMyCards,
    stageLabel,
    // actions
    initListeners,
    startGame,
    sendAction,
    resetGame,
    removeListeners
  }
})
