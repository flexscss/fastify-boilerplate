// import { logger } from '#libs/logger.mjs'
import {
  createUser,
  getUserByEmail,
  getUserById
} from '#repositories/user.mjs'
import {
  closeAllUserSessions,
  closeCurrentUserSession,
  createSession,
  getUserSessions
} from '#services/authentication.mjs'

export const getUserSessionsController = async function (req, res) {
  const sessions = await getUserSessions(req)
  res.code(200).send(sessions)
}

export const closeAllUserSessionsController = async function (req, res) {
  await closeAllUserSessions(req)
  res.code(200).send({
    message: 'All sessions closed'
  })
}

export const closeCurrentUserSessionsController = async function (req, res) {
  await closeCurrentUserSession(req)
  res.code(200).send({
    message: 'Session closed'
  })
}

export const registerController = async function (req, res) {
  const user = await createUser(req.body)
  const session = await createSession(req, user)
  const data = { user, session }
  res.code(200).send(data)
}

export const loginController = async function (req, res) {
  const user = await getUserByEmail(req.body)
  const session = await createSession(req, user)
  const data = { user, session }
  res.code(200).send(data)
}

export const isLoggedInController = async function (req, res) {
  const user = await getUserById(req.user.id)
  res.code(200).send(user)
}
