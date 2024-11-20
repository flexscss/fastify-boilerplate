import { telegramLoginController } from '#controllers/auth/telegram.mjs'

export default function (fastify) {
  fastify.post('/telegram/login', {
    handler: telegramLoginController
  })
}
