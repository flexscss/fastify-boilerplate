<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './Default.vue'
import DashboardLayout from './DashboardLayout.vue'

const route = useRoute()

const layouts = {
  default: DefaultLayout,
  dashboard: DashboardLayout
}

const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layouts[layoutName]
})
</script> 