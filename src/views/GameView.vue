<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import PlayerCard from '@/components/PlayerCard.vue'
import MyHand from '@/components/MyHand.vue'
import PotDisplay from '@/components/PotDisplay.vue'
import ActionPanel from '@/components/ActionPanel.vue'
import WinnersModal from '@/components/WinnersModal.vue'

const userStore = useUserStore()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.initListeners()
})

onUnmounted(() => {
  gameStore.removeListeners()
})

/**
 * Positions des adversaires autour de la table (ovale).
 * Le joueur local est toujours en bas ; les adversaires
 * sont répartis sur les positions restantes.
 */
const POSITIONS = [
  // Haut centre
  { top: '4%',  left: '50%',  transform: 'translateX(-50%)' },
  // Haut gauche
  { top: '12%', left: '12%',  transform: 'none' },
  // Haut droite
  { top: '12%', right: '12%', transform: 'none' },
  // Milieu gauche
  { top: '45%', left: '3%',   transform: 'translateY(-50%)' },
  // Milieu droite
  { top: '45%', right: '3%',  transform: 'translateY(-50%)' },
]

const opponents = computed(() => gameStore.otherPlayers)
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Table ovale -->
    <div class="absolute inset-8 lg:inset-16 rounded-[100px] lg:rounded-[200px] bg-pokito-bg/60 backdrop-blur-sm border-[10px] border-pokito-dark shadow-2xl shadow-black">
      <!-- Inner ring -->
      <div class="absolute inset-4 rounded-[80px] lg:rounded-[180px] border-2 border-cream-500/10"></div>
    </div>

    <!-- Pot central -->
    <PotDisplay v-if="gameStore.game" class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />

    <!-- Adversaires positionnés autour de la table -->
    <div
      v-for="(player, index) in opponents"
      :key="player.pseudo"
      class="absolute z-20"
      :style="POSITIONS[index % POSITIONS.length]"
    >
      <PlayerCard
        :player="player"
        :is-current-player="player.pseudo === gameStore.game?.currentPlayer"
      />
    </div>

    <!-- Joueur local (bas centre) -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pb-2">
      <!-- Info joueur local -->
      <div v-if="gameStore.myPlayer" class="flex items-center gap-3 mb-2 bg-pokito-dark/80 px-4 py-2 rounded-full border border-pokito-light backdrop-blur-sm">
        <img
          :src="userStore.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(userStore.pseudo)}`"
          :alt="userStore.pseudo"
          class="w-8 h-8 rounded-full border-2"
          :class="gameStore.isMyTurn ? 'border-gold-400' : 'border-gray-600'"
        />
        <span class="text-white font-semibold text-sm">{{ userStore.pseudo }}</span>
        <span class="text-gold-400 text-xs font-mono">{{ gameStore.myPlayer.chips }} 💰</span>
        <span
          v-if="gameStore.myPlayer.bet > 0"
          class="text-emerald-400 text-xs"
        >
          Mise: {{ gameStore.myPlayer.bet }}
        </span>
      </div>

      <!-- Mes cartes -->
      <MyHand />

      <!-- Panel d'actions -->
      <ActionPanel />
    </div>

    <!-- Message d'attente -->
    <div
      v-if="gameStore.game && !gameStore.isMyTurn && !gameStore.myPlayer?.isFolded"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
    >
      <p class="text-gray-400 text-sm bg-gray-900/80 backdrop-blur px-4 py-2 rounded-full">
        En attente de <span class="text-white font-semibold">{{ gameStore.game.currentPlayer }}</span>…
      </p>
    </div>

    <!-- Modal gagnants -->
    <WinnersModal />
  </div>
</template>
