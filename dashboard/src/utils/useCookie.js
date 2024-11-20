export function useCookie() {
  const getOneWeekFromNow = () => {
    const date = new Date()
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
    return date.toUTCString()
  }

  const COOKIE_EXPIRY_ONE_WEEK = getOneWeekFromNow()
  const COOKIE_EXPIRY_REMOVE = 'Thu, 01 Jan 1970 00:00:00 UTC'
  const DEFAULT_PATH = '/'

  const createCookieString = (name, value, options = {}) => {
    const { expires = COOKIE_EXPIRY_ONE_WEEK, path = DEFAULT_PATH } = options
    return `${name}=${value}; path=${path}; expires=${expires}`
  }

  const parseCookies = () => {
    return document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=')
        acc[key] = value
        return acc
      }, {})
  }

  const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && value.constructor === Object
  }

  const set = (key, value) => {
    if (isPlainObject(key)) {
      Object.entries(key).forEach(([k, v]) => {
        document.cookie = createCookieString(k, v)
      })
      return
    }
    document.cookie = createCookieString(key, value)
  }

  const remove = (key) => {
    const options = {
      expires: COOKIE_EXPIRY_REMOVE,
      path: DEFAULT_PATH
    }

    if (isPlainObject(key)) {
      Object.keys(key).forEach((k) => {
        document.cookie = createCookieString(k, '', options)
      })
      return
    }
    document.cookie = createCookieString(key, '', options)
  }

  const get = (key) => {
    const cookies = parseCookies()

    if (Array.isArray(key)) {
      return key.reduce((acc, k) => {
        acc[k] = cookies[k] || null
        return acc
      }, {})
    }

    return cookies[key] || null
  }

  const clearAll = () => {
    const cookies = parseCookies()
    Object.keys(cookies).forEach((name) => {
      remove(name)
    })
  }

  return { set, remove, get, clearAll }
}
