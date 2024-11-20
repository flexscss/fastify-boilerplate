import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '#db/prisma.mjs'
import { fastify } from '#libs/fastify.mjs'
import { logger } from '#libs/logger.mjs'
import authenticate from '#middlewares/authenticate.mjs'
import AutoLoad from '@fastify/autoload'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'

const __dirname = dirname(fileURLToPath(import.meta.url))

fastify.setValidatorCompiler(({ schema }) => {
  return (data) => {
    return schema.validate(data)
  }
})

fastify.setErrorHandler((error, _request, reply) => {
  console.error(error)
  if (error.isCustom) {
    reply.status(400).send({ message: error.message })
  }
  else {
    reply.status(500).send({ message: 'Internal Server Error' })
  }
})

fastify.register(fastifyJwt, {
  secret: 'supersecret'
})

fastify.register(AutoLoad, {
  dir: join(__dirname, 'routes')
})

fastify.decorate('authenticate', authenticate)

fastify.register(fastifyCors, {
  origin: true
})

fastify.listen({ port: 3000 }, async (err) => {
  logger.info(`Server Listening on Port 3000`)
  try {
    await prisma.$connect()
    logger.info('Testing DB Connection. OK')
    prisma.$disconnect()
  }
  catch (error) {
    logger.error('Can\'t Connect to DB: ', error)
  }
  if (err)
    throw err
})
