export function mapRoutesToActions(routes) {
  if (!routes || !routes.length)
    return {}

  const modelActions = {}

  routes.forEach((route) => {
    if (!route.model || !route.method || !route.path)
      return

    const modelName = route.model.toLowerCase()
    if (!modelActions[modelName]) {
      modelActions[modelName] = {
        actions: {}
      }
    }

    let actionType
    if (route.method.toLowerCase() === 'get') {
      actionType = route.path.includes(':id') ? 'getOne' : 'get'
    }
    else if (route.method.toLowerCase() === 'post') {
      actionType = 'post'
    }
    else if (route.method.toLowerCase() === 'put') {
      actionType = 'put'
    }
    else if (route.method.toLowerCase() === 'delete') {
      actionType = 'delete'
    }

    if (actionType) {
      modelActions[modelName].actions[actionType] = route
    }
  })

  return modelActions
}
