<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: { type: Object, required: true },
  isCurrentPlayer: { type: Boolean, default: false }
})

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
}

const suitColors = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-white',
  spades: 'text-white'
}

function getAvatarUrl(pseudo) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(pseudo)}`
}

const playerCards = computed(() => props.player.cards || [])
</script>

<template>
  <div
    class="flex flex-col items-center transition-opacity duration-300"
    :class="player.isFolded ? 'opacity-40' : 'opacity-100'"
  >
    <!-- Avatar + info -->
    <div class="relative mb-1">
      <!-- Indicateur tour -->
      <div
        v-if="isCurrentPlayer && !player.isFolded"
        class="absolute -inset-1 rounded-full bg-cream-500/30 animate-pulse"
      ></div>

      <img
        :src="player.avatar || getAvatarUrl(player.pseudo)"
        :alt="player.pseudo"
        class="w-12 h-12 rounded-full border-2 relative z-10"
        :class="isCurrentPlayer ? 'border-cream-500 shadow-[0_0_15px_rgba(252,236,180,0.5)]' : 'border-pokito-light'"
      />

      <!-- Badge couché -->
      <span
        v-if="player.isFolded"
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-mexican-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20 whitespace-nowrap"
      >
        Couché
      </span>
    </div>

    <!-- Pseudo + chips -->
    <p class="text-white text-xs font-semibold truncate max-w-[100px] text-center mt-1 bg-pokito-dark/80 px-2 rounded-md">
      {{ player.pseudo }}
    </p>
    <p class="text-cream-400 text-[10px] font-mono mt-0.5">
      {{ player.chips }} 💰
    </p>

    <!-- Mise actuelle -->
    <p v-if="player.bet > 0" class="text-emerald-400 text-[10px] font-mono mt-0.5">
      Mise: {{ player.bet }}
    </p>

    <!-- Cartes -->
    <div class="flex gap-1 mt-1">
      <div
        v-for="(card, index) in playerCards"
        :key="index"
        class="w-10 h-14 rounded-md border flex items-center justify-center text-xs font-bold shadow-md"
        :class="card.visible
          ? 'bg-white border-gray-300'
          : 'card-back border-pokito-light'"
      >
        <template v-if="card.visible && card.suit">
          <span :class="suitColors[card.suit]">
            {{ card.rank }}{{ suitSymbols[card.suit] }}
          </span>
        </template>
        <template v-else>
          <span class="text-pokito-light text-lg">?</span>
        </template>
      </div>
    </div>
  </div>
</template>
