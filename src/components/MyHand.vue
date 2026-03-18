<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
}

const suitColors = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-gray-800',
  spades: 'text-gray-800'
}

const cards = computed(() => gameStore.mergedMyCards)
</script>

<template>
  <div class="flex gap-2 justify-center">
    <TransitionGroup name="card" tag="div" class="flex gap-2">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="relative w-16 h-22 rounded-lg border-2 flex flex-col items-center justify-center font-bold shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
        :class="[
          card.suit ? 'bg-white' : 'card-back border-blue-900',
          !card.visible ? 'border-gold-400 ring-2 ring-gold-400/30' : 'border-gray-300'
        ]"
        :style="{ minHeight: '5.5rem' }"
      >
        <template v-if="card.suit">
          <!-- Coin haut gauche -->
          <span
            class="absolute top-1 left-1.5 text-[10px] leading-none"
            :class="suitColors[card.suit]"
          >
            {{ card.rank }}<br />{{ suitSymbols[card.suit] }}
          </span>

          <!-- Symbole central -->
          <span
            class="text-2xl"
            :class="suitColors[card.suit]"
          >
            {{ suitSymbols[card.suit] }}
          </span>

          <!-- Rank dessous -->
          <span
            class="text-sm mt-0.5"
            :class="suitColors[card.suit]"
          >
            {{ card.rank }}
          </span>

          <!-- Coin bas droite -->
          <span
            class="absolute bottom-1 right-1.5 text-[10px] leading-none rotate-180"
            :class="suitColors[card.suit]"
          >
            {{ card.rank }}<br />{{ suitSymbols[card.suit] }}
          </span>

          <!-- Badge cachée -->
          <span
            v-if="!card.visible"
            class="absolute -top-2 -right-2 bg-gold-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow"
          >
            🔒
          </span>
        </template>
        <template v-else>
          <span class="text-blue-300/50 text-2xl">?</span>
        </template>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.card-enter-active {
  transition: all 0.4s ease-out;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
</style>
