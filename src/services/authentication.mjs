import crypto from 'node:crypto'
import redis from '#db/redis.mjs'
import { CustomError } from '#libs/error.mjs'
import { fastify } from '#libs/fastify.mjs'
import { v4 as uuidv4 } from 'uuid'

export async function createSession(req, user) {
  const userAgent = req.headers['user-agent']
  let device = req.headers['x-device-id']
  if (device) {
    const currentDeviceSession = await redis.get(`user:${user.id}:device:${device}`)
    if (!currentDeviceSession)
      device = uuidv4()
  }
  else {
    device = uuidv4()
  }

  const token = fastify.jwt.sign({
    user: user.id,
    role: user.role.name,
    device
  })

  const sessionKey = `user:${user.id}:device:${device}`
  await redis.set(sessionKey, JSON.stringify({ token, device, userAgent }))
  await redis.expire(sessionKey, 3600)
  return { token, device }
}

export const getUserSessions = async function (req) {
  const sessionKey = `user:${req.user.id}:device:*`
  const keys = await redis.keys(sessionKey)
  const sessions = await Promise.all(keys.map(key => redis.get(key).then(JSON.parse)))
  return sessions || []
}

export const closeCurrentUserSession = async function (req) {
  const sessionKey = `user:${req.user.id}:device:${req.user.device}`
  await redis.del(sessionKey)
  return true
}

export const closeAllUserSessions = async function (req) {
  const sessionKey = `user:${req.user.id}:device:*`
  const keys = await redis.keys(sessionKey)
  await Promise.all(keys.map(key => redis.del(key)))
  return true
}

const botToken = '###'

export function validateTelegramData(req) {
  const encoded = decodeURIComponent(req.body.data)

  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)

  const arr = encoded.split('&')
  const hashIndex = arr.findIndex(str => str.startsWith('hash='))
  const hash = arr.splice(hashIndex)[0].split('=')[1]

  arr.sort((a, b) => a.localeCompare(b))

  const dataCheckString = arr.join('\n')

  const _hash = crypto
    .createHmac('sha256', secret.digest())
    .update(dataCheckString)
    .digest('hex')

  if (_hash === hash) {
    let user = arr.find(a => a.includes('user='))
    if (!user)
      throw new CustomError('Invalid user')
    user = user.replace('user=', '')
    user = JSON.parse(user)
    return user
  }
  throw new CustomError('Invalid data')
}
