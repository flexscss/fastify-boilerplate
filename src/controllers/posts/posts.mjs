import { createPost, deletePost, getPostById, getPosts, updatePost } from '#repositories/post.mjs'

export const getPostByIdController = async function (req, res) {
  const post = await getPostById(req.params.id)
  res.code(200).send(post)
}

export const getPostsController = async function (req, res) {
  const posts = await getPosts(req)
  res.code(200).send(posts)
}

export const createPostController = async function (req, res) {
  const post = await createPost(req.body)
  res.code(200).send(post)
}

export const updatePostController = async function (req, res) {
  const post = await updatePost(req.params.id, req.body)
  res.code(200).send(post)
}

export const deletePostController = async function (req, res) {
  await deletePost(req.params.id)
  res.code(200).send({ message: 'Post deleted' })
}
