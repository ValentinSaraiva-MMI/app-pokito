<script setup>
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <div v-if="gameStore.game" class="flex flex-col items-center gap-1">
    <!-- Stage -->
    <span class="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
      {{ gameStore.stageLabel }}
    </span>

    <!-- Pot -->
    <div class="bg-pokito-dark/80 backdrop-blur-sm border border-cream-500/30 rounded-xl px-6 py-3 text-center shadow-lg">
      <p class="text-gold-400 text-2xl font-bold font-mono">
        {{ gameStore.game.pot }} 💰
      </p>
      <p class="text-gray-400 text-[11px] mt-0.5">Pot total</p>
    </div>

    <!-- Mise à suivre -->
    <div
      v-if="gameStore.game.currentBet > 0"
      class="bg-gray-800/70 border border-gray-600 rounded-lg px-4 py-1.5 text-center mt-1"
    >
      <span class="text-emerald-400 text-sm font-semibold font-mono">
        {{ gameStore.game.currentBet }}
      </span>
      <span class="text-gray-500 text-[11px] ml-1">à suivre</span>
    </div>
  </div>
</template>
