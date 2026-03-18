<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const gameStore = useGameStore()

const activeTab = ref('join') // 'join' | 'create'
const tableCode = ref('')
const errorMsg = ref('')
const loading = ref(false)

onMounted(() => {
  if (route.query.tab && ['join', 'create'].includes(route.query.tab)) {
    activeTab.value = route.query.tab
  }
})

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
  <div class="min-h-screen flex flex-col items-center p-4">
    <!-- Header avec Logo et Bouton Mon Compte -->
    <div class="w-full max-w-5xl flex justify-between items-center mb-6 mt-4">
      <img src="/logo.png" alt="Pokito" class="h-16 md:h-24 drop-shadow-md cursor-pointer hover:scale-105 transition-transform" @click="router.push({ name: 'Home' })" />
      
      <div class="flex items-center gap-4">
        <button
          v-if="!userStore.isGuest"
          @click="router.push({ name: 'Profile' })"
          class="flex items-center gap-3 px-5 py-2 md:py-3 bg-[#FEF4E1] text-[#471C66] border-[4px] border-[#F6C643] font-extrabold rounded-full hover:bg-[#F3E2C4] hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D6006D]">
            <img :src="userStore.avatar" alt="avatar" class="w-full h-full object-cover bg-[#fddc84]" />
          </div>
          <span class="hidden md:inline text-xl">Mon compte</span>
        </button>
      </div>
    </div>

    <!-- Container central du lobby -->
    <div class="w-full max-w-3xl flex flex-col items-center animate-fade-in mt-4">
      
      <h1 class="text-2xl md:text-4xl font-extrabold text-[#471C66] mb-8 bg-[#FEF4E1] px-8 py-3 rounded-full border-[4px] border-[#F6C643] shadow-lg">
        Bienvenue <span class="text-[#D6006D]">{{ userStore.pseudo }}</span> !
      </h1>

      <!-- Card Principale -->
      <div class="w-full bg-[#FEF4E1] rounded-[32px] border-[6px] border-[#F6C643] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300">
        
        <!-- Tabs -->
        <div class="flex">
          <button
            class="flex-1 py-5 md:py-6 text-center text-xl md:text-3xl font-extrabold tracking-wide transition-colors"
            :class="activeTab === 'join' ? 'text-[#D6006D] bg-[#FEF4E1]' : 'text-[#471C66] bg-[#FBF0D9] border-b-[6px] border-r-[3px] border-[#F6C643] hover:bg-[#f3e2c4]'"
            @click="activeTab = 'join'; errorMsg = ''"
          >
            🔑 Rejoindre
          </button>
          <button
            class="flex-1 py-5 md:py-6 text-center text-xl md:text-3xl font-extrabold tracking-wide transition-colors"
            :class="activeTab === 'create' ? 'text-[#D6006D] bg-[#FEF4E1]' : 'text-[#471C66] bg-[#FBF0D9] border-b-[6px] border-l-[3px] border-[#F6C643] hover:bg-[#f3e2c4]'"
            @click="activeTab = 'create'; errorMsg = ''"
          >
            ✨ Créer
          </button>
        </div>

        <div class="p-8 md:p-12 flex flex-col items-center">
          
          <!-- Onglet Rejoindre -->
          <div v-if="activeTab === 'join'" class="w-full max-w-md flex flex-col items-center animate-fade-in">
            <p class="text-[#471C66] font-bold text-lg md:text-xl mb-6 text-center">
              Entrez le code de la table pour rejoindre une partie.
            </p>
            <input
              v-model="tableCode"
              type="text"
              maxlength="10"
              placeholder="EX: ABCD12"
              class="w-full px-6 py-4 md:py-5 bg-transparent border-4 border-[#471C66] rounded-[24px] text-center text-[#471C66] font-bold text-2xl tracking-widest uppercase placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] transition font-mono mb-8"
              @keyup.enter="handleJoin"
            />
            <button
              :disabled="loading || !tableCode.trim()"
              class="w-full py-4 md:py-5 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleJoin"
            >
              <span v-if="loading" class="animate-pulse">Connexion...</span>
              <span v-else>Rejoindre la table</span>
            </button>
          </div>

          <!-- Onglet Créer -->
          <div v-if="activeTab === 'create'" class="w-full max-w-md flex flex-col items-center animate-fade-in text-[#471C66]">
            
            <div class="bg-[#FBF0D9] border-4 border-[#F6C643] rounded-[24px] p-6 mb-8 w-full shadow-inner">
              <h3 class="text-xl font-extrabold mb-4 text-[#D6006D] text-center">Nouvelle table</h3>
              <ul class="text-lg font-bold space-y-3">
                <li class="flex items-center gap-3">
                  <span class="text-[#F6C643] text-2xl">●</span> Table publique
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-[#F6C643] text-2xl">●</span> 6 joueurs maximum
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-[#F6C643] text-2xl">●</span> Five-Card Stud (Pokito)
                </li>
              </ul>
            </div>

            <button
              :disabled="loading"
              class="w-full py-4 md:py-5 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleCreate"
            >
              <span v-if="loading" class="animate-pulse">Création...</span>
              <span v-else>🃏 Créer une table</span>
            </button>
          </div>

          <!-- Erreur -->
          <div class="h-6 mt-4">
            <Transition name="fade">
              <p v-if="errorMsg" class="text-white font-bold text-sm text-center bg-red-500 px-4 py-1 rounded-full shadow border-2 border-red-700">
                {{ errorMsg }}
              </p>
            </Transition>
          </div>
          
        </div>
      </div>

      <!-- Retour -->
      <button
        class="mt-8 text-[#471C66] font-bold text-lg hover:text-[#D6006D] underline transition-colors"
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
