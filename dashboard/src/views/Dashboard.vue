<template>
  <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Welcome back, {{ userDisplayName }}!</h1>
        <p class="text-muted-foreground">You are now on the dashboard, where you can view metrics for your API.</p>
      </div>

      <div class="max-w-[700px]">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🚀 About the App</h2>
        <p class="text-gray-700 mb-4">
          This is a <span class="font-semibold">fun and flexible</span> app built with 
          <span class="font-semibold text-blue-600">Fastify</span> and 
          <span class="font-semibold text-blue-600">Prisma</span> on the backend, and 
          <span class="font-semibold text-blue-600">Vue 3</span> for the admin interface. 🛠️
        </p>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">What does it do?</h3>
        <p class="text-gray-700 mb-4">
          It’s designed to make creating <span class="font-semibold">REST APIs</span> easy and smooth — 
          perfect for small apps and websites (and who knows, maybe big ones in the future! 🌟).
        </p>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Why build it?</h3>
        <p class="text-gray-700">
          Right now, it’s a <span class="font-semibold">work-in-progress</span> 🏗️ and will eventually serve 
          as a <span class="font-semibold">boilerplate</span> for my other projects. Think of it as the foundation 
          for cool things yet to come! 🚀
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Models</CardTitle>
            <Boxes class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ models.length }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Routes</CardTitle>
            <Route class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ routes.length }}</div>
          </CardContent>
        </Card>
      </div>
    </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Boxes, Route } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { useBackendDataStore } from '@/stores/backendDataStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const backendDataStore = useBackendDataStore()
const models = computed(() => backendDataStore.models)
const routes = computed(() => backendDataStore.routes)
const userDisplayName = computed(() => {
  if (!user.value) return 'Guest'
  return user.value.name || user.value.email || 'User'
})
</script>
