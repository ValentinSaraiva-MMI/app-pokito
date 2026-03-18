<script setup>
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="gameStore.notification || gameStore.error"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
    >
      <div
        class="rounded-xl px-5 py-3 shadow-2xl backdrop-blur border text-center text-sm font-medium"
        :class="gameStore.error
          ? 'bg-red-900/80 border-red-700 text-red-200'
          : 'bg-gray-800/90 border-gray-600 text-white'"
      >
        {{ gameStore.error || gameStore.notification }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.3s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
