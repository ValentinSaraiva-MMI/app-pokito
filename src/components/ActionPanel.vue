<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const raiseAmount = ref(0)
const showRaiseInput = ref(false)

const myBet = computed(() => gameStore.myCurrentBet)
const currentBet = computed(() => gameStore.game?.currentBet ?? 0)
const myChips = computed(() => gameStore.myPlayer?.chips ?? 0)

const canCheck = computed(() => myBet.value >= currentBet.value)
const callCost = computed(() => currentBet.value - myBet.value)
const minRaise = computed(() => currentBet.value + 1)

function doCheck() {
  gameStore.sendAction('check')
}

function doCall() {
  gameStore.sendAction('call', currentBet.value)
}

function doFold() {
  gameStore.sendAction('fold')
  showRaiseInput.value = false
}

function toggleRaise() {
  showRaiseInput.value = !showRaiseInput.value
  if (showRaiseInput.value) {
    raiseAmount.value = minRaise.value
  }
}

function doRaise() {
  if (raiseAmount.value < minRaise.value) {
    raiseAmount.value = minRaise.value
    return
  }
  gameStore.sendAction('raise', raiseAmount.value)
  showRaiseInput.value = false
}
</script>

<template>
  <div v-if="gameStore.isMyTurn" class="w-full max-w-lg mx-auto mt-2">
    <!-- Raise slider/input (affichage conditionnel) -->
    <Transition name="slide">
      <div
        v-if="showRaiseInput"
        class="bg-gray-900/90 backdrop-blur border border-gray-600 rounded-xl p-4 mb-2"
      >
        <div class="flex items-center gap-3 mb-2">
          <label class="text-gray-400 text-sm whitespace-nowrap">Montant :</label>
          <input
            v-model.number="raiseAmount"
            type="range"
            :min="minRaise"
            :max="myChips"
            class="flex-1 accent-gold-400"
          />
          <input
            v-model.number="raiseAmount"
            type="number"
            :min="minRaise"
            :max="myChips"
            class="w-20 bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-white text-center text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gold-400"
          />
        </div>
        <div class="flex items-center justify-between text-[11px] text-gray-500 mb-3">
          <span>Min: {{ minRaise }}</span>
          <span>All-in: {{ myChips }}</span>
        </div>
        <button
          :disabled="raiseAmount < minRaise"
          class="w-full py-2 rounded-lg font-bold text-sm transition-all
                 bg-gold-500 text-pokito-dark border-b-4 border-gold-600
                 hover:bg-gold-400 hover:translate-y-[2px] hover:border-b-2
                 active:translate-y-[4px] active:border-b-0
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-4"
          @click="doRaise"
        >
          Confirmer la relance ({{ raiseAmount }})
        </button>
      </div>
    </Transition>

    <!-- Boutons d'action -->
    <div class="flex gap-2 justify-center">
      <!-- Fold -->
      <button
        class="px-4 py-2.5 rounded-lg font-bold text-sm transition-all
               bg-mexican-red text-white border-b-4 border-red-900
               hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0"
        @click="doFold"
      >
        Se coucher
      </button>

      <!-- Check -->
      <button
        v-if="canCheck"
        class="px-4 py-2.5 rounded-lg font-bold text-sm transition-all
               bg-pokito-light text-cream-400 border-b-4 border-pokito-dark
               hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0"
        @click="doCheck"
      >
        Parole
      </button>

      <!-- Call -->
      <button
        v-if="!canCheck"
        class="px-4 py-2.5 rounded-lg font-bold text-sm transition-all
               bg-teal-600 text-white border-b-4 border-teal-800
               hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0"
        @click="doCall"
      >
        Suivre (+{{ callCost }})
      </button>

      <!-- Raise -->
      <button
        class="px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg border-b-4"
        :class="showRaiseInput
          ? 'bg-gray-600 text-white border-gray-800 hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0'
          : 'bg-gold-500 text-pokito-dark border-gold-600 hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0'"
        @click="toggleRaise"
      >
        {{ showRaiseInput ? 'Annuler' : 'Relancer' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
