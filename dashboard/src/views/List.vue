<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold capitalize">{{ modelName }}</h1>
      <div class="flex gap-2 min-h-9">
        <Button v-if="actions?.post" @click="handleCreate">
          <Plus class="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="field in displayFields" :key="field">
              {{ formatFieldName(field) }}
            </TableHead>
            <TableHead v-if="displayFields.length" class="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow>
              <TableCell :colspan="displayFields.length + 1">
                <TableSkeleton :columns="displayFields.length + 1" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="items && items.length > 0">
            <TableRow v-for="item in items" :key="item.id">
              <TableCell v-for="field in displayFields" :key="field">
                {{ formatFieldValue(item[field], field) }}
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button v-if="actions?.put" variant="ghost" size="icon" @click="handleEdit(item)">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button v-if="actions?.delete" variant="ghost" size="icon" @click="handleDelete(item)">
                    <Trash class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="displayFields.length + 1" class="h-24 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <InboxIcon class="h-8 w-8 text-muted-foreground" />
                <p class="text-lg font-medium">No data available</p>
                <p class="text-sm text-muted-foreground">
                  {{ actions?.post ? 'Get started by creating a new record.' : 'No records found.' }}
                </p>
								<Button v-if="actions?.post" @click="handleCreate" class="mt-2">
									<Plus class="mr-2 h-4 w-4" />
									Add New
								</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-if="pagination.total > 0"
				class="flex items-center justify-between p-4 border-t">
        <p class="text-sm text-muted-foreground">
          Showing {{ items.length }} of {{ pagination.total }} items
        </p>
        <div class="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            :disabled="pagination.offset === 0"
            @click="loadPage(pagination.offset - pagination.limit)"
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            :disabled="!pagination.hasMore"
            @click="loadPage(pagination.offset + pagination.limit)"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useApi } from '@/api/instance'
import { useBackendDataStore } from '@/stores/backendDataStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash, Inbox as InboxIcon } from 'lucide-vue-next'
import TableSkeleton from '@/components/ui/table/TableSkeleton.vue'

const route = useRoute()
const router = useRouter()
const api = useApi()
const backendStore = useBackendDataStore()

const items = ref([])
const pagination = ref({
  total: 0,
  offset: 0,
  limit: 10,
  hasMore: false
})
const modelName = ref('')
const displayFields = ref([])
const actions = ref(null)
const loading = ref(true)

const formatFieldName = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

const formatFieldValue = (value) => {
  if (!value) return ''
  if (typeof value === 'object') {
    return value.name || value.title || value.id || JSON.stringify(value)
  }
  return value
}

const getDisplayFields = (model) => {
  return Object.keys(model.fields || {})
    .filter(key => !key.toLowerCase().includes('id'))
}

const getModelActions = (modelParam) => {
  return backendStore.getModelActions(modelParam)
}

const getModel = (modelParam) => {
  const model = backendStore.models.find(
    m => m.modelName.toLowerCase() === modelParam.toLowerCase()
  )
  
  if (!model) {
    console.error('Model not found:', modelParam)
    return false
  }
  return model
}

const loadPage = async (to, offset = 0) => {
  loading.value = true
  try {
		const model = getModel(to.params.model)
    if (!model) return

    if (to.params.model !== modelName.value) {
      items.value = []
      pagination.value = {
        total: 0,
        offset: 0,
        limit: 10,
        hasMore: false
      }
    }

    const _actions = getModelActions(to.params.model)
    if (!actions) return

    const getAction = _actions?.get
    if (!getAction?.path) {
      console.error('Get action not found for model:', modelName)
      modelName.value = model.modelName
      displayFields.value = []
      return
    }

    const response = await api.get(
      `${getAction.path}?offset=${offset}&limit=${pagination.value.limit}`
    )
    
    modelName.value = model.modelName
    displayFields.value = getDisplayFields(model)
    actions.value = _actions
    items.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push(`/models/${modelName.value}/create`)
}

const handleEdit = (item) => {
  router.push(`/models/${modelName.value}/edit/${item.id}`)
}

const handleDelete = async (item) => {
  if (!actions.value?.delete?.path) {
    console.error('Delete action not found')
    return
  }

  if (!confirm('Are you sure you want to delete this item?')) return

  try {
    await api.delete(`${actions.value.delete.path}/${item.id}`)
    await loadPage(route, pagination.value.offset)
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.model !== from.params.model) {
    await loadPage(to)
  }
  next()
})

defineExpose({ loadPage })
</script>

<script>
export default {
  async beforeRouteEnter(to, _from, next) {
    next(async (vm) => {
      await vm.loadPage(to)
    })
  }
}
</script>