<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginCard from '@/components/LoginCard.vue'

const router = useRouter()
const userStore = useUserStore()

const pseudo = ref('')
const selectedSeed = ref('Felix')
const errorMsg = ref('')
const loading = ref(false)

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
      <LoginCard
        v-model:pseudo="pseudo"
        v-model:selected-seed="selectedSeed"
        :error-msg="errorMsg"
        :loading="loading"
        @join="handleJoin"
      />

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
