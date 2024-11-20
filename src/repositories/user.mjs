import { prisma } from '#db/prisma.mjs'
import { CustomError } from '#libs/error.mjs'
import { omitPassword } from '#utils/omits.mjs'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12
const DEFAULT_ROLE = 'user'
const PROVIDER = {
  LOCAL: 'local',
  TELEGRAM: 'telegram'
}

export const createUser = async function (data) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const password = await bcrypt.hash(data.password, salt)

    const role = await prisma.role.findUnique({ where: { name: DEFAULT_ROLE } })
    if (!role) {
      throw new CustomError('Role does not exist')
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) {
      throw new CustomError('Email is already taken')
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        roleId: role.id,
        provider: PROVIDER.LOCAL
      }
    })
    return { ...omitPassword(user), role }
  }
  catch (error) {
    throw error
  }
}

export const createUserFromTelegram = async function (data) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: data.id },
      include: { role: true }
    })
    if (existingUser) {
      return omitPassword(existingUser)
    }

    const role = await prisma.role.findUnique({ where: { name: DEFAULT_ROLE } })
    if (!role) {
      throw new CustomError('Role does not exist')
    }

    const user = await prisma.user.create({
      data: {
        telegramId: data.id,
        provider: PROVIDER.TELEGRAM,
        roleId: role.id
      }
    })
    return { ...omitPassword(user), role }
  }
  catch (error) {
    throw error
  }
}

export const getUserByEmail = async function ({ email, password }) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    include: { role: true }
  })

  if (!user) {
    throw new CustomError('User not found')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new CustomError('Invalid password')
  }

  return omitPassword(user)
}

export const getUserById = async function (id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true }
  })
  return omitPassword(user)
}
