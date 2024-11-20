import { useAuthApi } from '@/api/auth'
import { useCookie } from '@/utils/useCookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const authApi = useAuthApi()
  const { set: setCookie, remove: removeCookie } = useCookie()

  const authenticate = ({ token, device }) => {
    isAuthenticated.value = true
    setCookie({ token, device })
  }

  const login = async (credentials) => {
    try {
      const res = await authApi.login(credentials)
      const { session: { token, device }, user: userData } = res
      user.value = userData
      authenticate({ token, device })
      return user.value
    }
    catch (error) {
      throw error
    }
  }

  const loadUser = async () => {
    try {
      const res = await authApi.checkLoggedIn()
      user.value = res
      isAuthenticated.value = true
      return res
    }
    catch (error) {
      throw error
    }
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    removeCookie(['token', 'deviceId'])
  }

  const logout = async () => {
    try {
      await authApi.logout()
      clearUser()
    }
    catch (error) {
      console.error('Logout error:', error)
      clearUser()
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    loadUser,
    clearUser,
    authenticate
  }
})
