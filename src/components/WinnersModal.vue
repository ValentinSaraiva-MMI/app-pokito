<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const gameStore = useGameStore()
const userStore = useUserStore()

function getAvatarUrl(pseudo) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(pseudo)}`
}

function handleReplay() {
  gameStore.resetGame()
  router.push({ name: 'WaitingRoom', params: { tableId: userStore.tableId } })
}

function handleQuit() {
  gameStore.resetGame()
  router.push({ name: 'Lobby' })
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="gameStore.winners.length > 0"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div class="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
        <!-- Titre -->
        <div class="text-4xl mb-2">🏆</div>
        <h2 class="text-2xl font-poker font-bold text-gold-400 mb-6">Fin de la partie !</h2>

        <!-- Gagnants -->
        <div class="space-y-3 mb-8">
          <div
            v-for="winner in gameStore.winners"
            :key="winner.pseudo"
            class="flex items-center gap-4 bg-gray-900/60 rounded-xl p-4 border border-gold-400/30"
          >
            <img
              :src="getAvatarUrl(winner.pseudo)"
              :alt="winner.pseudo"
              class="w-14 h-14 rounded-full border-2 border-gold-400"
            />
            <div class="text-left">
              <p class="text-white font-bold text-lg">{{ winner.pseudo }}</p>
              <p class="text-gold-400 text-sm">
                {{ winner.score?.text || 'Vainqueur' }}
              </p>
            </div>
            <span class="ml-auto text-3xl">🥇</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            class="flex-1 py-3 rounded-lg font-bold transition-all
                   bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                   hover:from-emerald-500 hover:to-emerald-400"
            @click="handleReplay"
          >
            🔄 Rejouer
          </button>
          <button
            class="flex-1 py-3 rounded-lg font-bold transition-all
                   bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
            @click="handleQuit"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active {
  transition: all 0.3s ease-out;
}
.modal-leave-active {
  transition: all 0.25s ease-in;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
