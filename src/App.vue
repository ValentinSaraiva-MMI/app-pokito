<script setup>
import NotificationToast from '@/components/NotificationToast.vue'
</script>

<template>
  <div class="min-h-screen text-cream-400">
    <RouterView />
    <NotificationToast />
  </div>
</template>
