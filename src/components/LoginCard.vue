<script setup>
import { ref, computed } from 'vue'

const avatarSeeds = [
  'Felix', 'Aneka', 'Whiskers', 'Bandit', 'Patches',
  'Gizmo', 'Shadow', 'Cookie', 'Milo', 'Bella',
  'Lucky', 'Tiger'
]

const pseudo = defineModel('pseudo', { default: '' })
const selectedSeed = defineModel('selectedSeed', { default: 'Felix' })

defineProps({
  errorMsg: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['join'])

const activeTab = ref('anonyme')
const carouselIndex = ref(0)

const prevSeed = computed(() => avatarSeeds[(carouselIndex.value - 1 + avatarSeeds.length) % avatarSeeds.length])
const currentSeed = computed(() => avatarSeeds[carouselIndex.value])
const nextSeed = computed(() => avatarSeeds[(carouselIndex.value + 1) % avatarSeeds.length])

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
}

function prevAvatar() {
  carouselIndex.value = (carouselIndex.value - 1 + avatarSeeds.length) % avatarSeeds.length
  selectedSeed.value = currentSeed.value
}

function nextAvatar() {
  carouselIndex.value = (carouselIndex.value + 1) % avatarSeeds.length
  selectedSeed.value = currentSeed.value
}

function joinAnonymous() {
  pseudo.value = `Joueur#${Math.floor(1000 + Math.random() * 9000)}`
  emit('join', 'private')
}

function joinPublic() {
  emit('join', 'public')
}
</script>

<template>
  <div class="rounded-2xl border-2 border-purple-300 overflow-hidden shadow-xl" style="background-color: #FFF4DC">

    <!-- Tabs -->
    <div class="grid grid-cols-2">
      <button
        class="py-4 font-bold text-lg tracking-wide transition-colors border-b-2"
        :class="activeTab === 'anonyme'
          ? 'text-pink-500 border-b-transparent'
          : 'text-gray-400 border-b-purple-300 bg-[#f5eacc]'"
        @click="activeTab = 'anonyme'"
      >
        ANONYME
      </button>
      <button
        class="py-4 font-bold text-lg tracking-wide transition-colors border-l-2 border-purple-300 border-b-2"
        :class="activeTab === 'connexion'
          ? 'text-pink-500 border-b-transparent'
          : 'text-gray-400 border-b-purple-300 bg-[#f5eacc]'"
        @click="activeTab = 'connexion'"
      >
        CONNEXION
      </button>
    </div>

    <!-- Content -->
    <div class="p-8 flex flex-col items-center gap-6">

      <!-- ANONYME -->
      <template v-if="activeTab === 'anonyme'">
        <h2 class="text-xl font-bold text-gray-800 text-center leading-snug">
          Choisissez<br>votre avatar
        </h2>

        <!-- Carousel -->
        <div class="flex items-center gap-4">
          <button
            class="w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-800 transition"
            @click="prevAvatar"
          >‹</button>

          <div class="flex items-center gap-3">
            <img :src="getAvatarUrl(prevSeed)" class="w-14 h-14 rounded-full opacity-50" :alt="prevSeed" />
            <div class="ring-4 ring-pink-400 rounded-full p-0.5 shadow-md">
              <img :src="getAvatarUrl(currentSeed)" class="w-18 h-18 rounded-full" :alt="currentSeed" style="width:4.5rem;height:4.5rem" />
            </div>
            <img :src="getAvatarUrl(nextSeed)" class="w-14 h-14 rounded-full opacity-50" :alt="nextSeed" />
          </div>

          <button
            class="w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-800 transition"
            @click="nextAvatar"
          >›</button>
        </div>

        <Transition name="fade">
          <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
        </Transition>

        <button
          :disabled="loading"
          class="w-full py-3 rounded-full font-bold text-white text-lg bg-pink-500 hover:bg-pink-400 active:scale-95 transition disabled:opacity-40"
          @click="joinAnonymous"
        >
          <span v-if="loading" class="inline-flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Connexion…
          </span>
          <span v-else>Jouer en privé</span>
        </button>
      </template>

      <!-- CONNEXION -->
      <template v-else>
        <h2 class="text-xl font-bold text-gray-800 text-center leading-snug">
          Rentrez<br>votre pseudo
        </h2>

        <input
          v-model="pseudo"
          type="text"
          maxlength="15"
          placeholder="Pseudo"
          class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-400 transition"
          @keyup.enter="joinPublic"
        />

        <Transition name="fade">
          <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
        </Transition>

        <button
          :disabled="loading || pseudo.trim().length < 2"
          class="w-full py-3 rounded-full font-bold text-white text-lg bg-pink-500 hover:bg-pink-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
          @click="joinPublic"
        >
          <span v-if="loading" class="inline-flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Connexion…
          </span>
          <span v-else>Jouer en public</span>
        </button>
      </template>

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
