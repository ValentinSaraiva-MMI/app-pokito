<script setup>
import NotificationToast from '@/components/NotificationToast.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <RouterView />
    <NotificationToast />
  </div>
</template>
