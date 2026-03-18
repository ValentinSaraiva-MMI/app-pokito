<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const pseudo = ref('')
const errorMsg = ref('')
const loading = ref(false)

// Avatars DiceBear — seeds prédéfinis
const avatarSeeds = [
  'Felix', 'Aneka', 'Whiskers', 'Bandit', 'Patches',
  'Gizmo', 'Shadow', 'Cookie', 'Milo', 'Bella',
  'Lucky', 'Tiger'
]
const selectedSeed = ref(avatarSeeds[0])

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
}

async function handleJoin() {
  const name = pseudo.value.trim()
  if (name.length < 2 || name.length > 15) {
    errorMsg.value = 'Le pseudo doit contenir entre 2 et 15 caractères.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await userStore.joinAsGuest(name, getAvatarUrl(selectedSeed.value))
    router.push({ name: 'Lobby' })
  } catch (err) {
    errorMsg.value = err.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-felt-900 p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Titre -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-poker font-bold text-gold-400 mb-2">♠ Pokito</h1>
        <p class="text-gray-400 text-sm">Poker Mexicain — Five-Card Stud</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 p-8">
        <!-- Pseudo -->
        <div class="mb-6">
          <label for="pseudo" class="block text-sm font-medium text-gray-300 mb-2">
            Votre pseudo
          </label>
          <input
            id="pseudo"
            v-model="pseudo"
            type="text"
            maxlength="15"
            placeholder="Ex: DarkSasuké"
            class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
            @keyup.enter="handleJoin"
          />
        </div>

        <!-- Avatars -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-3">
            Choisissez votre avatar
          </label>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="seed in avatarSeeds"
              :key="seed"
              type="button"
              class="relative rounded-xl p-1 transition-all duration-200 hover:scale-110"
              :class="selectedSeed === seed
                ? 'ring-3 ring-gold-400 bg-gold-400/20 scale-105'
                : 'ring-1 ring-gray-600 hover:ring-gray-400 bg-gray-900'"
              @click="selectedSeed = seed"
            >
              <img
                :src="getAvatarUrl(seed)"
                :alt="seed"
                class="w-full aspect-square rounded-lg"
              />
              <span
                v-if="selectedSeed === seed"
                class="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center text-xs text-gray-900 font-bold"
              >✓</span>
            </button>
          </div>
        </div>

        <!-- Erreur -->
        <Transition name="fade">
          <p v-if="errorMsg" class="mb-4 text-red-400 text-sm text-center bg-red-900/30 rounded-lg py-2 px-3">
            {{ errorMsg }}
          </p>
        </Transition>

        <!-- Bouton Jouer -->
        <button
          :disabled="loading || pseudo.trim().length < 2"
          class="w-full py-3 rounded-lg font-bold text-lg transition-all duration-200
                 bg-gradient-to-r from-gold-500 to-gold-400 text-gray-900
                 hover:from-gold-400 hover:to-yellow-300 hover:shadow-lg hover:shadow-gold-400/25
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          @click="handleJoin"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Connexion…
          </span>
          <span v-else>🎴 Jouer</span>
        </button>
      </div>

      <p class="text-center text-gray-600 text-xs mt-6">
        Pokito v1.0 — Five-Card Stud en ligne
      </p>
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
