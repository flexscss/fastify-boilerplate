import {
  closeAllUserSessionsController,
  closeCurrentUserSessionsController,
  getUserSessionsController,
  isLoggedInController,
  loginController,
  registerController
} from '#controllers/auth/basic.mjs'
import {
  createUserValidationSchema,
  getUserValidationSchema
} from '#validations/user.mjs'

export default function (fastify) {
  fastify.get('/basic/sessions', {
    preHandler: [fastify.authenticate],
    handler: getUserSessionsController
  })
  fastify.get('/basic/sessions/close', {
    preHandler: [fastify.authenticate],
    handler: closeCurrentUserSessionsController
  })
  fastify.get('/basic/sessions/close-all', {
    preHandler: [fastify.authenticate],
    handler: closeAllUserSessionsController
  })
  fastify.post('/basic/register', {
    schema: {
      body: createUserValidationSchema
    },
    handler: registerController
  })
  fastify.post('/basic/login', {
    schema: {
      body: getUserValidationSchema
    },
    handler: loginController
  })
  fastify.get('/basic/check', {
    preHandler: [fastify.authenticate],
    handler: isLoggedInController
  })
}
