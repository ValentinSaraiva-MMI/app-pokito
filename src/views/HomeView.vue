<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const currentMode = ref('anonyme') // 'anonyme' | 'connexion' | 'inscription'

// Formulaire Anonyme (L'existant)
const pseudo = ref('')
const errorMsg = ref('')
const loading = ref(false)

const avatarSeeds = ['Felix', 'Aneka', 'Jack']
const selectedSeed = ref(avatarSeeds[1])

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
}

// Formulaire Connexion
const formConnexion = ref({ email: '', password: '' })

// Formulaire Inscription
const formInscription = ref({ email: '', phone: '', day: '', month: '', year: '', pseudo: '', password: '', confirm: '' })

async function handleLoginMode(tabOption) {
  const name = pseudo.value.trim()
  
  if (name.length < 2 || name.length > 15) {
    errorMsg.value = 'Le pseudo doit contenir entre 2 et 15 caractères.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const avatar = getAvatarUrl(selectedSeed.value)
    await userStore.joinAsGuest(name, avatar)
    router.push({ name: 'Lobby', query: { tab: tabOption } })
  } catch (err) {
    errorMsg.value = err.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

async function handleSystemLogin() {
  const { email, password } = formConnexion.value
  if (!email || !password) {
    errorMsg.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await userStore.loginUser(email, password)
    // Redirection vers le lobby une fois connecté
    router.push({ name: 'Lobby', query: { tab: 'join' } })
  } catch (err) {
    errorMsg.value = err.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  const { email, phone, day, month, year, pseudo: p, password, confirm } = formInscription.value
  
  if (!email || !p || !password) {
    errorMsg.value = 'Veuillez remplir les champs obligatoires (Email, Pseudo, Mot de passe).'
    return
  }
  if (password !== confirm) {
    errorMsg.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  
  loading.value = true
  errorMsg.value = ''

  try {
    // On ajoute toutes les infos au payload car tu vas peut-être les ajouter en base
    const birthdate = (year && month && day) ? `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}` : null
    
    await userStore.registerUser({
      email,
      password,
      pseudo: p,
      phone,
      birthdate
    })
    
    router.push({ name: 'Lobby', query: { tab: 'join' } })
  } catch (err) {
    errorMsg.value = err.message || 'Erreur d\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <!-- Logo -->
    <div class="mb-6 md:mb-10 w-full text-center">
      <img src="/logo.png" alt="Pokito" class="mx-auto h-24 md:h-32 drop-shadow-xl" />
    </div>

    <!-- ERREUR GLOBALE -->
    <div class="h-6 mb-2">
      <Transition name="fade">
        <p v-if="errorMsg" class="text-red-500 font-bold text-sm text-center bg-red-100 px-4 py-1 rounded-full border border-red-300">
          {{ errorMsg }}
        </p>
      </Transition>
    </div>

    <!-- BOX ANONYME / CONNEXION -->
    <div v-if="currentMode !== 'inscription'" class="w-full max-w-4xl bg-[#FEF4E1] rounded-[32px] border-[6px] border-[#F6C643] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300">
      
      <!-- Ligne d'onglets - Header -->
      <div class="flex">
        <!-- Onglet Anonyme -->
        <button
          class="flex-1 py-5 md:py-7 text-center text-2xl md:text-4xl font-extrabold tracking-wide transition-colors"
          :class="currentMode === 'anonyme' ? 'text-[#D6006D] bg-[#FEF4E1]' : 'text-[#471C66] bg-[#FBF0D9] border-b-[6px] border-r-[3px] border-[#F6C643] hover:bg-[#f3e2c4]'"
          @click="currentMode = 'anonyme'; errorMsg = ''"
        >
          ANONYME
        </button>
        <!-- Onglet Connexion -->
        <button
          class="flex-1 py-5 md:py-7 text-center text-2xl md:text-4xl font-extrabold tracking-wide transition-colors"
          :class="currentMode === 'connexion' ? 'text-[#D6006D] bg-[#FEF4E1]' : 'text-[#471C66] bg-[#FBF0D9] border-b-[6px] border-l-[3px] border-[#F6C643] hover:bg-[#f3e2c4]'"
          @click="currentMode = 'connexion'; errorMsg = ''"
        >
          CONNEXION
        </button>
      </div>

      <!-- Corps (Anonyme) -->
      <div v-if="currentMode === 'anonyme'" class="p-8 md:p-12 flex flex-col items-center text-[#471C66] animate-fade-in">
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
          <!-- Gauche: Avatar -->
          <div class="flex-1 flex flex-col items-center justify-center">
            <h2 class="text-2xl md:text-[32px] font-bold mb-6 md:mb-10 text-center leading-sm">Choisissez<br/>votre avatar</h2>
            <div class="flex gap-4 md:gap-6">
              <button
                v-for="seed in avatarSeeds"
                :key="seed"
                class="rounded-full transition-transform hover:scale-105 relative"
                :class="selectedSeed === seed ? 'ring-[6px] ring-[#D6006D]' : 'ring-[6px] ring-[#F6C643] opacity-80 hover:opacity-100'"
                @click="selectedSeed = seed"
              >
                <img
                  :src="getAvatarUrl(seed)"
                  :alt="seed"
                  class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#fddc84] object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Droite: Pseudo -->
          <div class="flex-1 flex flex-col items-center justify-center">
            <h2 class="text-2xl md:text-[32px] font-bold mb-6 md:mb-10 text-center leading-sm">Rentrez<br/>votre pseudo</h2>
            <input
              v-model="pseudo"
              type="text"
              placeholder="Pseudo"
              class="w-full max-w-[340px] px-6 py-4 md:py-5 bg-transparent border-4 border-[#471C66] rounded-[24px] text-center text-[#471C66] font-bold text-xl md:text-2xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] transition"
              @keyup.enter="handleLoginMode('create')"
            />
          </div>
        </div>

        <!-- Footer Boutons Anonyme -->
        <div class="mt-12 w-full flex flex-col sm:flex-row gap-6 justify-center">
          <button
            :disabled="loading || pseudo.trim().length < 2"
            class="flex-1 max-w-[300px] py-4 md:py-6 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleLoginMode('join')"
          >
            <span v-if="loading" class="animate-pulse">...</span>
            <span v-else>Jouer en privé</span>
          </button>
          <button
            :disabled="loading || pseudo.trim().length < 2"
            class="flex-1 max-w-[300px] py-4 md:py-6 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleLoginMode('create')"
          >
            <span v-if="loading" class="animate-pulse">...</span>
            <span v-else>Jouer en public</span>
          </button>
        </div>
      </div>

      <!-- Corps (Connexion) -->
      <div v-if="currentMode === 'connexion'" class="p-8 md:p-12 flex flex-col items-center text-[#471C66] animate-fade-in">
        <div class="w-full max-w-md space-y-6 md:space-y-8">
          <div class="flex flex-col items-center">
            <!-- Modification mineure : L'API attend "email" pour le login -->
            <label class="text-xl md:text-2xl font-bold mb-3 text-center">Rentrez votre email (ou pseudo)</label>
            <input v-model="formConnexion.email" type="text" placeholder="Votre email ou pseudo" class="w-full px-6 py-4 md:py-5 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center text-[#471C66] font-bold text-xl md:text-2xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] transition" @keyup.enter="handleSystemLogin" />
          </div>
          <div class="flex flex-col items-center">
            <label class="text-xl md:text-2xl font-bold mb-3 text-center">Rentrez votre mot de passe</label>
            <input v-model="formConnexion.password" type="password" placeholder="Votre mot de passe" class="w-full px-6 py-4 md:py-5 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center text-[#471C66] font-bold text-xl md:text-2xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D] transition" @keyup.enter="handleSystemLogin" />
          </div>
          
          <div class="flex flex-col items-center text-base md:text-lg font-semibold space-y-2 mt-6">
            <p>Pas encore de compte ? <button @click="currentMode = 'inscription'; errorMsg = ''" class="text-[#471C66] underline hover:text-[#D6006D]">Inscription</button></p>
            <button class="text-[#471C66] underline hover:text-[#D6006D]">Mot de passe oublié ?</button>
          </div>

          <div class="flex justify-center mt-10">
            <button
              :disabled="loading || !formConnexion.email || !formConnexion.password"
              class="px-12 py-4 md:py-5 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all w-full max-w-[300px] disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleSystemLogin"
            >
              <span v-if="loading" class="animate-pulse">...</span>
              <span v-else>Connexion</span>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- BOX INSCRIPTION -->
    <div v-if="currentMode === 'inscription'" class="w-full max-w-4xl relative flex flex-col items-center animate-fade-in">
      <!-- Onglet Inscription découpé au-dessus -->
      <div class="flex w-full justify-center relative z-10 -mb-[6px]">
        <div class="bg-[#FEF4E1] border-[6px] border-b-0 border-[#F6C643] rounded-t-[32px] px-10 md:px-14 py-4 md:py-5 relative">
          <h2 class="text-3xl md:text-4xl font-extrabold text-[#D6006D] tracking-wide uppercase">Inscription</h2>
          <!-- Cache-bordure pour fondre avec la boite principale -->
          <div class="absolute -bottom-[6px] left-0 right-0 h-[6px] bg-[#FEF4E1] z-20"></div>
        </div>
      </div>

      <!-- Corps Inscription -->
      <div class="w-full bg-[#FEF4E1] rounded-[32px] border-[6px] border-[#F6C643] shadow-2xl relative flex flex-col p-8 md:p-12 z-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full text-[#471C66]">
          
          <!-- Colonne 1 -->
          <div class="space-y-6 md:space-y-8 flex flex-col items-center">
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Rentrez votre email</label>
              <input v-model="formInscription.email" type="email" placeholder="Email" class="w-full px-6 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
            </div>
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Rentrez votre téléphone</label>
              <input v-model="formInscription.phone" type="tel" placeholder="Numéro de téléphone" class="w-full px-6 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
            </div>
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Rentrez votre date de naissance</label>
              <div class="flex gap-3 w-full justify-center">
                <input v-model="formInscription.day" type="text" placeholder="JJ" maxlength="2" class="w-16 md:w-20 px-2 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
                <input v-model="formInscription.month" type="text" placeholder="MM" maxlength="2" class="w-16 md:w-20 px-2 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
                <input v-model="formInscription.year" type="text" placeholder="AAAA" maxlength="4" class="flex-1 px-2 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
              </div>
            </div>
          </div>

          <!-- Colonne 2 -->
          <div class="space-y-6 md:space-y-8 flex flex-col items-center">
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Rentrez votre pseudo</label>
              <input v-model="formInscription.pseudo" type="text" placeholder="Pseudo" class="w-full px-6 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
            </div>
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Définissez votre mot de passe</label>
              <input v-model="formInscription.password" type="password" placeholder="Mot de passe" class="w-full px-6 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
            </div>
            <div class="flex flex-col items-center w-full">
              <label class="text-[1.1rem] md:text-xl font-bold mb-3 text-center">Réécrivez votre mot de passe</label>
              <input v-model="formInscription.confirm" type="password" placeholder="Mot de passe" class="w-full px-6 py-3 md:py-4 border-4 border-[#471C66] rounded-[24px] bg-transparent text-center font-bold text-lg md:text-xl placeholder-[#471C66]/50 focus:outline-none focus:border-[#D6006D]" />
            </div>
          </div>
          
        </div>

        <!-- Footer Inscription -->
        <div class="flex flex-col items-center mt-10 md:mt-12">
          <p class="text-base md:text-lg font-semibold text-[#471C66] mb-6">
            Déjà un compte ? <button @click="currentMode = 'connexion'; errorMsg = ''" class="underline hover:text-[#D6006D]">Connexion</button>
          </p>
          <button
            :disabled="loading || formInscription.pseudo.trim().length < 2"
            class="px-12 py-4 md:py-5 rounded-full font-bold text-2xl md:text-[28px] text-white bg-[#D6006D] hover:bg-[#C00060] hover:scale-[1.02] active:scale-95 transition-all w-full max-w-[340px] disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleRegister"
          >
            <span v-if="loading" class="animate-pulse">...</span>
            <span v-else>Inscription</span>
          </button>
        </div>
      </div>
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

.leading-sm {
  line-height: 1.1;
}
</style>
