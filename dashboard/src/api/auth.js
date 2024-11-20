import { useApi } from './instance'

const BASE_AUTH_URL = '/api/v1/auth/basic'
export function useAuthApi() {
  const api = useApi()

  const login = (credentials) => {
    return api.post(`${BASE_AUTH_URL}/login`, credentials)
  }

  const register = (userData) => {
    return api.post(`${BASE_AUTH_URL}/register`, userData)
  }

  const logout = () => {
    return api.post(`${BASE_AUTH_URL}/logout`)
  }

  const checkLoggedIn = () => {
    return api.get(`${BASE_AUTH_URL}/check`)
  }

  return {
    login,
    register,
    logout,
    checkLoggedIn
  }
}
