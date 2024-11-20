<template>
  <div class="w-full">
    <div class="flex items-center space-x-4">
      <Skeleton v-for="n in columns" :key="n" class="h-4" :style="{ width: `${Math.random() * 20 + 10}%` }" />
    </div>
    <div v-for="i in rows" :key="i" class="mt-4">
      <div class="flex items-center space-x-4">
        <Skeleton v-for="n in columns" :key="n" class="h-4" :style="{ width: `${Math.random() * 30 + 20}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  columns: {
    type: Number,
    default: 4
  },
  rows: {
    type: Number,
    default: 5
  }
})
</script> 