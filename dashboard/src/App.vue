<template>
  <LayoutWrapper>
    <router-view></router-view>
  </LayoutWrapper>
  <Notifications />
</template>

<script setup>
import LayoutWrapper from '@/components/layouts/LayoutWrapper.vue'
import Notifications from '@/components/ui/Notifications.vue'
</script>
