<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-auto min-w-[300px] max-w-[420px]">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="w-full flex items-center gap-x-2 rounded-lg p-4"
        :class="{
          'bg-emerald-500 text-white': notification.type === 'success',
          'bg-destructive text-destructive-foreground': notification.type === 'error',
          'bg-secondary text-secondary-foreground': notification.type === 'default'
        }"
      >
        <div class="flex-1 flex items-start gap-2">
          <div class="h-4 w-4 mt-0.5 shrink-0">
            <CheckCircle2 v-if="notification.type === 'success'" class="h-4 w-4" />
            <XCircle v-else-if="notification.type === 'error'" class="h-4 w-4" />
            <Info v-else class="h-4 w-4" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold leading-none tracking-tight">
              {{ notification.title }}
            </p>
            <p class="text-sm opacity-90 mt-1">
              {{ notification.description }}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 shrink-0 text-current hover:text-current/80 hover:bg-white/20"
          @click="removeNotification(notification.id)"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { X, CheckCircle2, XCircle, Info } from 'lucide-vue-next'

const uiStore = useUIStore()
const { notifications } = storeToRefs(uiStore)
const { removeNotification } = uiStore
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.2s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style> 