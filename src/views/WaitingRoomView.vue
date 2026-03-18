<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const copied = ref(false)
const errorMsg = ref('')

onMounted(() => {
  gameStore.initListeners()
})

// Redirige vers GameView dès qu'un game:state arrive
watch(() => gameStore.game, (val) => {
  if (val && val.stage) {
    router.push({ name: 'Game', params: { tableId: userStore.tableId } })
  }
})

function copyCode() {
  navigator.clipboard.writeText(userStore.tableCode).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function handleStart() {
  if (gameStore.players.length < 2) {
    errorMsg.value = 'Il faut au moins 2 joueurs pour lancer la partie.'
    setTimeout(() => { errorMsg.value = '' }, 3000)
    return
  }
  gameStore.startGame(userStore.tableId)
}

function getAvatarUrl(pseudo) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(pseudo)}`
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-felt-900 p-4">
    <div class="w-full max-w-lg">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-poker font-bold text-gold-400 mb-1">Salle d'attente</h1>
        <p class="text-gray-400 text-sm">En attente des joueurs…</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 p-8">
        <!-- Code de la table -->
        <div class="text-center mb-8">
          <p class="text-gray-400 text-xs uppercase tracking-wider mb-2">Code de la table</p>
          <button
            class="inline-flex items-center gap-3 bg-gray-900 rounded-xl px-6 py-4 border border-gray-600 hover:border-gold-400 transition group"
            @click="copyCode"
          >
            <span class="text-3xl font-mono font-bold tracking-[0.3em] text-white group-hover:text-gold-400 transition">
              {{ userStore.tableCode || '------' }}
            </span>
            <span class="text-gray-500 group-hover:text-gold-400 transition text-lg">
              {{ copied ? '✓' : '📋' }}
            </span>
          </button>
          <p class="text-gray-500 text-xs mt-2">
            {{ copied ? 'Copié !' : 'Cliquez pour copier' }}
          </p>
        </div>

        <!-- Joueurs -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Joueurs
            </h2>
            <span class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
              {{ gameStore.players.length }} / 6
            </span>
          </div>

          <div class="space-y-2">
            <div
              v-for="player in gameStore.players"
              :key="player.pseudo || player.socketId"
              class="flex items-center gap-3 bg-gray-900/60 rounded-lg p-3 border border-gray-700"
            >
              <img
                :src="player.avatar || getAvatarUrl(player.pseudo)"
                :alt="player.pseudo"
                class="w-10 h-10 rounded-full bg-gray-700"
              />
              <span class="text-white font-medium">{{ player.pseudo }}</span>
              <span
                v-if="player.pseudo === userStore.pseudo"
                class="ml-auto text-xs bg-gold-400/20 text-gold-400 px-2 py-0.5 rounded-full"
              >
                Vous
              </span>
            </div>

            <!-- Placeholder si vide -->
            <div
              v-if="gameStore.players.length === 0"
              class="text-center py-8 text-gray-500 text-sm"
            >
              <p class="text-2xl mb-2">👥</p>
              <p>En attente de joueurs…</p>
              <p class="text-xs mt-1">Partagez le code ci-dessus</p>
            </div>
          </div>
        </div>

        <!-- Erreur -->
        <Transition name="fade">
          <p v-if="errorMsg" class="mb-4 text-red-400 text-sm text-center bg-red-900/30 rounded-lg py-2 px-3">
            {{ errorMsg }}
          </p>
        </Transition>

        <!-- Bouton Lancer -->
        <button
          :disabled="gameStore.players.length < 2"
          class="w-full py-3 rounded-lg font-bold text-lg transition-all duration-200
                 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25
                 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="handleStart"
        >
          🚀 Lancer la partie
        </button>
        <p
          v-if="gameStore.players.length < 2"
          class="text-center text-gray-500 text-xs mt-2"
        >
          Minimum 2 joueurs requis
        </p>
      </div>

      <!-- Retour -->
      <button
        class="block mx-auto mt-4 text-gray-500 text-sm hover:text-gray-300 transition"
        @click="router.push({ name: 'Lobby' })"
      >
        ← Retour au lobby
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
