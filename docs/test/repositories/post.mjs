import { prisma } from '#db/prisma.mjs'
import { buildWhereClause, getPaginationData, parseOrderBy } from '#utils/queryHelper.mjs'

export const getPostById = async function (id) {
  try {
    const post = await prisma.post.findUnique({ where: { id } })
    return post
  }
  catch (error) {
    throw error
  }
}

export const getPosts = async function ({ query = {} }) {
  try {
    const where = buildWhereClause(query)
    const orderBy = parseOrderBy(query.orderBy)
    const { limit = 10, offset = 0 } = query

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy,
        include: {
          author: true
        }
      }),
      prisma.post.count({ where })
    ])

    return {
      data: posts,
      pagination: getPaginationData({
        total,
        offset,
        limit,
        itemsLength: posts.length
      })
    }
  }
  catch (error) {
    throw error
  }
}

export const createPost = async function (data) {
  try {
    const post = await prisma.post.create({ data })
    return post
  }
  catch (error) {
    throw error
  }
}

export const updatePost = async function (id, data) {
  try {
    const post = await prisma.post.update({ where: { id }, data })
    return post
  }
  catch (error) {
    throw error
  }
}

export const deletePost = async function (id) {
  try {
    await prisma.post.delete({ where: { id } })
  }
  catch (error) {
    throw error
  }
}
