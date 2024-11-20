import { createUserFromTelegram } from '#repositories/user.mjs'
import { createSession, validateTelegramData } from '#services/authentication.mjs'

export const telegramLoginController = async function (req, res) {
  const telegramUser = await validateTelegramData(req)
  const user = await createUserFromTelegram(telegramUser)
  const session = await createSession(req, user)
  const data = { user, session }
  res.code(200).send(data)
}
