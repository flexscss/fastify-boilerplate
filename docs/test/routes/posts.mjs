import {
  createPostController,
  deletePostController,
  getPostByIdController,
  getPostsController,
  updatePostController
} from '#controllers/posts/posts.mjs'

export default function (fastify) {
  fastify.get('/posts/:id', {
    preHandler: [fastify.authenticate],
    handler: getPostByIdController
  })
  fastify.get('/posts', {
    preHandler: [fastify.authenticate],
    handler: getPostsController
  })
  fastify.post('/posts', {
    preHandler: [fastify.authenticate],
    handler: createPostController
  })
  fastify.put('/posts/:id', {
    preHandler: [fastify.authenticate],
    handler: updatePostController
  })
  fastify.delete('/posts/:id', {
    preHandler: [fastify.authenticate],
    handler: deletePostController
  })
}
