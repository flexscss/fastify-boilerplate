import redis from '#db/redis.mjs'
import { fastify } from '#libs/fastify.mjs'

export default async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const device = req.headers['x-device-id']

    if (!token || !device) {
      throw new Error('Token or device ID is missing')
    }

    const decoded = fastify.jwt.verify(token)

    const sessionKey = `user:${decoded.user}:device:${device}`
    const session = await redis.get(sessionKey)

    if (!session || JSON.parse(session).token !== token) {
      throw new Error('Invalid session')
    }

    redis.expire(sessionKey, 3600)

    req.user = { id: decoded.user, role: decoded.role, device: decoded.device }
  }
  catch (err) {
    console.log(err)
    res.code(401).send({ error: 'Unauthorized' })
  }
}
