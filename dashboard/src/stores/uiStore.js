import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const notifications = ref([])
  let notificationId = 0

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const addNotification = ({ title, description, type = 'default' }) => {
    const id = ++notificationId
    notifications.value.push({
      id,
      title,
      description,
      type
    })

    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }

  const showSuccess = (title, description) => {
    addNotification({ title, description, type: 'success' })
  }

  const showError = (title, description) => {
    addNotification({ title, description, type: 'error' })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError
  }
})
