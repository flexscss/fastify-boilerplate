<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Create {{ modelName }}</h1>
      <Button variant="outline" @click="router.back()">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>

    <Card class="max-w-2xl">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div v-for="(field, key) in modelFields" :key="key" class="space-y-2">
          <Label :for="key">{{ formatFieldName(key) }}</Label>
          
          <Input
            v-if="field.type === 'string'"
            :id="key"
            v-model="formData[key]"
            :placeholder="`Enter ${formatFieldName(key).toLowerCase()}`"
          />

          <Input
            v-else-if="field.type === 'number'"
            :id="key"
            type="number"
            v-model.number="formData[key]"
          />

          <div v-else-if="field.type === 'boolean'" class="flex items-center space-x-2">
            <Checkbox :id="key" v-model="formData[key]" />
          </div>

          <Input
            v-else-if="field.type === 'date'"
            :id="key"
            type="date"
            v-model="formData[key]"
          />

          <Input
            v-else
            :id="key"
            v-model="formData[key]"
            :placeholder="`Enter ${formatFieldName(key).toLowerCase()}`"
          />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" @click="router.back()">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Creating...' : 'Create' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useBackendDataStore } from '@/stores/backendDataStore'
import { useUIStore } from '@/stores/uiStore'
import { useApi } from '@/api/instance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const api = useApi()
const backendStore = useBackendDataStore()
const uiStore = useUIStore()

const formData = ref({})
const isSubmitting = ref(false)
const modelName = ref('')
const modelFields = ref({})
const actions = ref(null)

const formatFieldName = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
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

const initializeForm = (to) => {
  const model = getModel(to.params.model)
  if (!model) return

  const _actions = getModelActions(to.params.model)
  if (!_actions?.post) {
    console.error('Post action not found for model:', to.params.model)
    return
  }

  modelName.value = model.modelName
  modelFields.value = model.fields || {}
  actions.value = _actions
  
  formData.value = {}
  Object.entries(modelFields.value).forEach(([key, field]) => {
    switch (field.type) {
      case 'string':
        formData.value[key] = ''
        break
      case 'number':
        formData.value[key] = 0
        break
      case 'boolean':
        formData.value[key] = false
        break
      case 'date':
        formData.value[key] = ''
        break
      default:
        formData.value[key] = ''
    }
  })
}

const prepareFormData = () => {
  const data = {}
  Object.entries(formData.value).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      data[key] = value
    }
  })
  return data
}

const handleSubmit = async () => {
  if (!actions.value?.post) {
    uiStore.showError('Error', 'Create action not available')
    return
  }

  isSubmitting.value = true

  try {
    const data = prepareFormData()
    await api.post(actions.value.post.path, data)
    uiStore.showSuccess('Success', `${modelName.value} created successfully`)
    router.push(`/models/${modelName.value}`)
  } catch (error) {
    uiStore.showError('Error', error.message || 'Failed to create item')
  } finally {
    isSubmitting.value = false
  }
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.model !== from.params.model) {
    initializeForm(to)
  }
  next()
})

defineExpose({ initializeForm })
</script>

<script>
export default {
  async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      vm.initializeForm(to)
    })
  }
}
</script>