<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: String }
})
</script>

<template>
  <tbody :class="cn('[&_tr:last-child]:border-0', props.class)">
    <slot />
  </tbody>
</template> 