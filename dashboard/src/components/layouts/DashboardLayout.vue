<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-background border-r">
      <!-- User Profile Section -->
      <div class="p-4 border-b">
        <div class="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p class="font-medium">{{ userDisplayName }}</p>
            <p class="text-sm text-muted-foreground">{{ user?.role?.name || 'User' }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 space-y-2">
        <Button variant="ghost" class="w-full justify-start" asChild>
          <RouterLink to="/dashboard">
            <LayoutDashboard class="mr-2 h-4 w-4" />
            Dashboard
          </RouterLink>
        </Button>
        
        <!-- Models Navigation -->
        <div v-if="models.length" class="pt-2">
          <p class="mb-2 px-2 text-sm font-semibold flex items-center">
            <Boxes class="mr-2 h-4 w-4" />
            Models
          </p>
          <Button 
            v-for="model in models" 
            :key="model.modelName"
            variant="ghost" 
            class="w-full justify-start capitalize pl-8" 
            asChild
          >
            <RouterLink :to="`/models/${model.modelName.toLowerCase()}`">
              {{ model.modelName }}
            </RouterLink>
          </Button>
        </div>

        <Button variant="ghost" class="w-full justify-start" asChild>
          <RouterLink to="/routes">
            <Route class="mr-2 h-4 w-4" />
            Routes
          </RouterLink>
        </Button>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LayoutDashboard, Boxes, Route } from 'lucide-vue-next'
import { useBackendDataStore } from '@/stores/backendDataStore'
import { useUserStore } from '@/stores/userStore'

const backendDataStore = useBackendDataStore()
const userStore = useUserStore()

const models = computed(() => backendDataStore.models)
const user = computed(() => userStore.user)

const userDisplayName = computed(() => {
  if (!user.value) return 'Guest'
  return user.value.name || user.value.email || 'User'
})
</script> 