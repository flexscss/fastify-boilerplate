export const apiMap = {
  models: [
    {
      modelName: 'User',
      fields: {
        id: {
          required: true,
          type: 'string'
        },
        email: {
          unique: true
        },
        password: {
          type: 'string'
        },
        telegramId: {
          unique: true,
          type: 'number'
        },
        provider: {
          required: true
        },
        roleId: {
          required: true
        },
        role: {
          type: 'object',
          relation: 'Role'
        },
        createdAt: {
          required: true
        },
        posts: {
          required: true,
          type: 'array',
          items: {
            type: 'object',
            relation: 'Post'
          }
        }
      }
    },
    {
      modelName: 'Role',
      fields: {
        id: {
          required: true,
          type: 'string'
        },
        name: {
          required: true,
          unique: true
        },
        users: {
          required: true,
          type: 'array',
          items: {
            type: 'object',
            relation: 'User'
          }
        }
      }
    },
    {
      modelName: 'Post',
      fields: {
        id: {
          required: true,
          type: 'string'
        },
        title: {
          required: true
        },
        description: {
          required: true,
          type: 'string'
        },
        content: {
          required: true,
          type: 'string'
        },
        authorId: {
          required: true,
          type: 'string'
        },
        author: {
          type: 'object',
          relation: 'User'
        },
        createdAt: {
          required: true
        }
      }
    }

  ],
  routes: [
    {
      path: '/api/v1/posts/:id',
      model: 'post',
      method: 'GET'
    },
    {
      path: '/api/v1/posts',
      model: 'post',
      method: 'GET'
    },
    {
      path: '/api/v1/posts',
      model: 'post',
      method: 'POST'
    },
    {
      path: '/api/v1/posts/:id',
      model: 'post',
      method: 'PUT'
    },
    {
      path: '/api/v1/posts/:id',
      model: 'post',
      method: 'DELETE'
    }

  ]
}
