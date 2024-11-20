<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold capitalize">Routes</h1>
      <div class="flex gap-2 min-h-9">
      </div>
    </div>

    <div>
      <Card>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="loading">
                <TableRow>
                  <TableCell colspan="3">
                    <TableSkeleton :columns="3" />
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow v-for="route in routes" :key="route.path">
                  <TableCell>
                    <Badge :variant="getMethodVariant(route.method)">
                      {{ route.method }}
                    </Badge>
                  </TableCell>
                  <TableCell>{{ route.path }}</TableCell>
                  <TableCell>{{ route.access }}</TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBackendDataStore } from '@/stores/backendDataStore'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import TableSkeleton from '@/components/ui/table/TableSkeleton.vue'

const loading = ref(true)
const backendDataStore = useBackendDataStore()
const routes = computed(() => backendDataStore.routes)

const loadRoutes = async () => {
  loading.value = true
  try {
    await backendDataStore.fetchRoutes() // Assuming you have this method in your store
  } finally {
    loading.value = false
  }
}

const getMethodVariant = (method) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'success'
    case 'POST':
      return 'default'
    case 'PUT':
      return 'warning'
    case 'DELETE':
      return 'destructive'
    default:
      return 'secondary'
  }
}

defineExpose({ loadRoutes })
</script>

<script>
export default {
  async beforeRouteEnter(_to, _from, next) {
    next(async (vm) => {
      await vm.loadRoutes()
    })
  }
}
</script>
