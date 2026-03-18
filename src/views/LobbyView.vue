<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const activeTab = ref('join') // 'join' | 'create'
const tableCode = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleJoin() {
  const code = tableCode.value.trim().toUpperCase()
  if (!code) {
    errorMsg.value = 'Veuillez entrer un code de table.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await userStore.joinTable(code)
    gameStore.initListeners()
    router.push({ name: 'WaitingRoom', params: { tableId: userStore.tableId } })
  } catch (err) {
    errorMsg.value = err.message || 'Impossible de rejoindre la table'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  loading.value = true
  errorMsg.value = ''

  try {
    await userStore.createTable()
    gameStore.initListeners()
    router.push({ name: 'WaitingRoom', params: { tableId: userStore.tableId } })
  } catch (err) {
    errorMsg.value = err.message || 'Impossible de créer la table'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-felt-900 p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-poker font-bold text-gold-400 mb-1">♠ Pokito</h1>
        <p class="text-gray-400 text-sm">
          Bienvenue <span class="text-white font-semibold">{{ userStore.pseudo }}</span> !
        </p>
      </div>

      <!-- Card -->
      <div class="bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-gray-700">
          <button
            class="flex-1 py-3 text-sm font-semibold transition-colors"
            :class="activeTab === 'join'
              ? 'text-gold-400 border-b-2 border-gold-400 bg-gray-700/30'
              : 'text-gray-400 hover:text-gray-200'"
            @click="activeTab = 'join'; errorMsg = ''"
          >
            🔑 Rejoindre
          </button>
          <button
            class="flex-1 py-3 text-sm font-semibold transition-colors"
            :class="activeTab === 'create'
              ? 'text-gold-400 border-b-2 border-gold-400 bg-gray-700/30'
              : 'text-gray-400 hover:text-gray-200'"
            @click="activeTab = 'create'; errorMsg = ''"
          >
            ✨ Créer
          </button>
        </div>

        <div class="p-8">
          <!-- Onglet Rejoindre -->
          <div v-if="activeTab === 'join'">
            <p class="text-gray-400 text-sm mb-4">
              Entrez le code de la table pour rejoindre une partie.
            </p>
            <input
              v-model="tableCode"
              type="text"
              maxlength="10"
              placeholder="Ex: ABCD12"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-center text-xl tracking-widest uppercase placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition font-mono"
              @keyup.enter="handleJoin"
            />
            <button
              :disabled="loading || !tableCode.trim()"
              class="w-full mt-4 py-3 rounded-lg font-bold transition-all duration-200
                     bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                     hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25
                     disabled:opacity-40 disabled:cursor-not-allowed"
              @click="handleJoin"
            >
              <span v-if="loading" class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Connexion…
              </span>
              <span v-else>Rejoindre la table</span>
            </button>
          </div>

          <!-- Onglet Créer -->
          <div v-if="activeTab === 'create'">
            <div class="bg-gray-900/50 rounded-xl p-5 mb-5 border border-gray-700">
              <h3 class="text-white font-semibold mb-3">Nouvelle table</h3>
              <ul class="text-gray-400 text-sm space-y-2">
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400">●</span> Table publique
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400">●</span> 6 joueurs maximum
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400">●</span> Five-Card Stud (Poker Mexicain)
                </li>
              </ul>
            </div>
            <button
              :disabled="loading"
              class="w-full py-3 rounded-lg font-bold transition-all duration-200
                     bg-gradient-to-r from-gold-500 to-gold-400 text-gray-900
                     hover:from-gold-400 hover:to-yellow-300 hover:shadow-lg hover:shadow-gold-400/25
                     disabled:opacity-40 disabled:cursor-not-allowed"
              @click="handleCreate"
            >
              <span v-if="loading" class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Création…
              </span>
              <span v-else>🃏 Créer une table</span>
            </button>
          </div>

          <!-- Erreur -->
          <Transition name="fade">
            <p v-if="errorMsg" class="mt-4 text-red-400 text-sm text-center bg-red-900/30 rounded-lg py-2 px-3">
              {{ errorMsg }}
            </p>
          </Transition>
        </div>
      </div>

      <!-- Retour -->
      <button
        class="block mx-auto mt-4 text-gray-500 text-sm hover:text-gray-300 transition"
        @click="router.push({ name: 'Home' })"
      >
        ← Retour à l'accueil
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
