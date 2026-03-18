<script setup>
import { ref } from 'vue'

const avatarSeeds = [
  'Felix', 'Aneka', 'Whiskers', 'Bandit', 'Patches',
  'Gizmo', 'Shadow', 'Cookie', 'Milo', 'Bella',
  'Lucky', 'Tiger'
]

const pseudo = defineModel('pseudo', { default: '' })
const selectedSeed = defineModel('selectedSeed', { default: 'Felix' })

const props = defineProps({
  errorMsg: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['join'])

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
}
</script>

<template>
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
        @keyup.enter="emit('join')"
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
      @click="emit('join')"
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
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
