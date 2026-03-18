<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const tabs = ['AVATARS', 'CARTES', 'TABLES DE JEU', 'INFOS PERSO']
const activeTab = ref('INFOS PERSO')

// Avatars mock data pour la grille
const avatars = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  seed: `Seed${i}`,
  url: `https://api.dicebear.com/9.x/adventurer/svg?seed=Dummy${i}`,
  unlocked: i < 4,
  selected: i === 0
}))

// Formulaires pour Infos Perso
const formPseudo = ref('')
const formPassword = ref({ new: '', confirm: '' })

function goBack() {
  router.push({ name: 'Lobby' })
}

function updatePseudo() {
  if (formPseudo.value.trim().length > 0) {
    alert("Fonctionnalité en cours de développement (Update Pseudo)")
  }
}

function updatePassword() {
  if (formPassword.value.new === formPassword.value.confirm && formPassword.value.new.length > 0) {
    alert("Fonctionnalité en cours de développement (Update Password)")
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <!-- Top Header : Logo & Retour -->
    <div class="w-full max-w-5xl flex justify-between items-center mb-6 mt-4">
      <img src="/logo.png" alt="Pokito" class="h-16 md:h-24 drop-shadow-md cursor-pointer hover:scale-105 transition-transform" @click="goBack" />
      <button @click="goBack" class="px-6 py-3 bg-[#FEF4E1] text-[#471C66] border-[4px] border-[#F6C643] rounded-full font-extrabold hover:bg-[#F3E2C4] hover:scale-105 active:scale-95 transition-all shadow-md text-xl">
        Retour au Lobby
      </button>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="w-full max-w-5xl relative mt-4">
      
      <!-- Ligne d'onglets (style folder tabs) -->
      <div class="flex flex-wrap md:flex-nowrap items-end relative z-10 w-full mb-[-6px]">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 py-3 md:py-4 px-2 md:px-6 text-center text-sm md:text-xl font-extrabold transition-all relative whitespace-nowrap overflow-hidden text-ellipsis"
          :class="[
            activeTab === tab 
              ? 'text-[#D6006D] bg-[#FEF4E1] border-t-[6px] border-x-[6px] border-[#F6C643] rounded-t-2xl z-20 h-[110%] pb-5 md:pb-6' 
              : 'text-[#471C66] bg-[#FBF0D9] border-[6px] border-[#F6C643] rounded-t-2xl hover:bg-[#f3e2c4] z-10 opacity-90'
          ]"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute -bottom-[6px] left-0 right-0 h-[8px] bg-[#FEF4E1]"></div>
        </button>
      </div>

      <!-- Corps de la vue profil -->
      <div class="bg-[#FEF4E1] border-[6px] border-[#F6C643] rounded-b-[32px] rounded-tr-[32px] md:rounded-tr-none p-6 md:p-12 shadow-2xl relative z-0 w-full min-h-[400px]">
        
        <!-- ======================= -->
        <!-- ONGLET AVATARS          -->
        <!-- ======================= -->
        <div v-if="activeTab === 'AVATARS'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#D6006D]">Mes avatars</h2>
            <button class="px-6 py-2 border-4 border-[#D6006D] text-[#D6006D] rounded-full font-bold text-lg hover:bg-[#D6006D]/10 transition-colors">
              Boutique 🎁
            </button>
          </div>
          
          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4 md:gap-6">
            <div 
              v-for="avatar in avatars" 
              :key="avatar.id" 
              class="relative aspect-square rounded-full flex items-center justify-center overflow-hidden transition-all"
              :class="[
                avatar.selected ? 'ring-[6px] ring-[#D6006D] scale-105' : 
                avatar.unlocked ? 'ring-[6px] ring-[#F6C643] opacity-100 cursor-pointer hover:scale-105' : 'ring-[4px] ring-[#471C66]/30 bg-[#471C66]/50 opacity-50 grayscale'
              ]"
            >
              <img :src="avatar.url" class="w-full h-full object-cover" :class="avatar.unlocked ? 'bg-[#fddc84]' : 'bg-transparent'" />
            </div>
          </div>
        </div>

        <!-- ======================= -->
        <!-- ONGLET CARTES           -->
        <!-- ======================= -->
        <div v-if="activeTab === 'CARTES'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#D6006D]">Mes cartes</h2>
            <button class="px-6 py-2 border-4 border-[#D6006D] text-[#D6006D] rounded-full font-bold text-lg hover:bg-[#D6006D]/10 transition-colors">
              Boutique 🎁
            </button>
          </div>
          <!-- Grille simulant des cards -->
          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4 md:gap-6">
            <div 
              v-for="i in 14" 
              :key="'card'+i"
              class="aspect-[2.5/3.5] rounded-xl flex items-center justify-center font-bold text-3xl transition-transform"
              :class="[
                i === 1 ? 'ring-[4px] ring-[#D6006D] scale-105 bg-white text-black' : 
                i <= 3 ? 'ring-[4px] ring-[#F6C643] bg-white text-black cursor-pointer hover:scale-105' : 'ring-[4px] ring-[#471C66]/30 bg-[#471C66]/40 opacity-50 text-black grayscale'
              ]"
            >
              A♣
            </div>
          </div>
        </div>

        <!-- ======================= -->
        <!-- ONGLET TABLES DE JEU    -->
        <!-- ======================= -->
        <div v-if="activeTab === 'TABLES DE JEU'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#D6006D]">Mes tables de jeu</h2>
            <button class="px-6 py-2 border-4 border-[#D6006D] text-[#D6006D] rounded-full font-bold text-lg hover:bg-[#D6006D]/10 transition-colors">
              Boutique 🎁
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="i in 8" 
              :key="'table'+i"
              class="aspect-video rounded-xl bg-cover bg-center transition-transform"
              :style="{ backgroundImage: 'url(/bg.png)' }"
              :class="[
                i === 1 ? 'ring-[6px] ring-[#D6006D] scale-105' : 
                i <= 3 ? 'ring-[6px] ring-[#F6C643] cursor-pointer hover:scale-105' : 'ring-[4px] ring-[#471C66]/30 opacity-40 grayscale'
              ]"
            ></div>
          </div>
        </div>

        <!-- ======================= -->
        <!-- ONGLET INFOS PERSO      -->
        <!-- ======================= -->
        <div v-if="activeTab === 'INFOS PERSO'" class="animate-fade-in text-[#471C66]">
          <h2 class="text-2xl md:text-3xl font-extrabold text-[#D6006D] mb-8">Mes informations personnelles</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-lg md:text-xl font-bold mb-12">
            <div>
              <span class="opacity-80">Votre pseudo :</span> <span class="text-[#471C66]">{{ userStore.pseudo }}</span>
            </div>
            <div>
              <span class="opacity-80">Votre date de naissance :</span> <span>{{ userStore.birthdate ? userStore.birthdate.split('-').reverse().join('/') : 'Non renseignée' }}</span>
            </div>
            <div>
              <span class="opacity-80">Votre email :</span> <span>{{ userStore.email }}</span>
            </div>
            <div>
              <span class="opacity-80">Votre numéro de téléphone :</span> <span>{{ userStore.phone || 'Non renseigné' }}</span>
            </div>
          </div>

          <!-- Formulaires de modification -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-[3px] border-[#471C66]/20 pt-10">
            
            <!-- Changer de pseudo -->
            <div class="space-y-4">
              <div>
                <p class="font-bold text-lg text-[#471C66]">Changer de pseudo ?</p>
                <p class="font-bold text-lg text-[#471C66]">Rentrez votre nouveau pseudo</p>
              </div>
              <input 
                v-model="formPseudo" 
                type="text" 
                placeholder="Votre nouveau pseudo" 
                class="w-full px-6 py-3 border-[4px] border-[#471C66] rounded-[24px] bg-[#FEF4E1] placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] font-bold text-lg" 
              />
              <button 
                @click="updatePseudo"
                :disabled="!formPseudo.trim()"
                class="px-8 py-3 rounded-full font-bold text-xl text-white bg-[#D6006D] hover:bg-[#C00060] transition-colors disabled:opacity-50 mt-4"
              >
                Modifier mon pseudo
              </button>
            </div>

            <!-- Changer de mot de passe -->
            <div class="space-y-4">
              <div>
                <p class="font-bold text-lg text-[#471C66]">Changer de mot de passe ?</p>
                <p class="font-bold text-lg text-[#471C66]">Rentrez votre nouveau mot de passe</p>
              </div>
              <div class="flex gap-4">
                <input 
                  v-model="formPassword.new" 
                  type="password" 
                  placeholder="Votre nouveau mot de passe" 
                  class="flex-1 px-6 py-3 border-[4px] border-[#471C66] rounded-[24px] bg-[#FEF4E1] placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] font-bold text-lg" 
                />
                <input 
                  v-model="formPassword.confirm" 
                  type="password" 
                  placeholder="Votre nouveau mot de passe" 
                  class="flex-1 px-6 py-3 border-[4px] border-[#471C66] rounded-[24px] bg-[#FEF4E1] placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] font-bold text-lg" 
                />
              </div>
              <div class="flex justify-end mt-4">
                <button 
                  @click="updatePassword"
                  :disabled="!formPassword.new || formPassword.new !== formPassword.confirm"
                  class="px-8 py-3 rounded-full font-bold text-xl text-white bg-[#D6006D] hover:bg-[#C00060] transition-colors disabled:opacity-50"
                >
                  Modifier le mot de passe
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>