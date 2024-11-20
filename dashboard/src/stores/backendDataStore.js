import { apiMap } from '@/data/routes-map'
import { mapRoutesToActions } from '@/utils/routes-map'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBackendDataStore = defineStore('backendData', () => {
  const models = ref([])
  const routes = ref([])
  const modelActions = ref({})

  const getModelActions = (modelName) => {
    if (!modelName)
      return null
    return modelActions.value[modelName.toLowerCase()]?.actions || null
  }

  const getModelAction = (modelName, actionType) => {
    const actions = getModelActions(modelName)
    return actions ? actions[actionType] : null
  }

  const initializeStore = () => {
    if (apiMap.models)
      models.value = apiMap.models

    if (apiMap.routes) {
      routes.value = apiMap.routes
      modelActions.value = mapRoutesToActions(routes.value)
    }
  }

  initializeStore()

  return {
    models,
    routes,
    modelActions,
    getModelActions,
    getModelAction
  }
})
