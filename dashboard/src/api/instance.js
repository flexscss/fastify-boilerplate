import { useCookie } from '@/utils/useCookie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useApi() {
  const { get: getCookie } = useCookie()

  const getHeaders = () => {
    const { token, device } = getCookie(['token', 'device'])
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-Device-Id': device || ''
    }
  }

  const handleResponse = async (response) => {
    const data = await response.json()

    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  }

  const request = async (endpoint, options = {}) => {
    const headers = getHeaders()

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config)
      return handleResponse(response)
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  const get = endpoint => request(endpoint)

  const post = (endpoint, data) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })

  const put = (endpoint, data) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })

  const del = endpoint => request(endpoint, {
    method: 'DELETE'
  })

  return {
    get,
    post,
    put,
    delete: del
  }
}
