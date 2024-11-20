import fs from 'node:fs/promises'

export async function parseRouteFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8')
  const routes = []

  const routeMatches = content.matchAll(/fastify\.(get|post|put|delete)\(['"]([^'"]+)['"]/g)

  for (const match of routeMatches) {
    const [, method, route] = match
    const handlerMatch = content.match(/handler:\s*(\w+)/)

    if (handlerMatch) {
      const handler = handlerMatch[1]
      const apiPath = extractApiPath(filePath)

      routes.push({
        route: `${apiPath}${route}`,
        handler,
        method
      })
    }
  }

  return routes
}

function extractApiPath(filePath) {
  const routesIndex = filePath.indexOf('routes')
  if (routesIndex === -1)
    return ''

  const routePath = filePath
    .slice(routesIndex + 'routes'.length)
    .replace(/\.mjs$/, '')
    .replace(/\\/g, '/')

  const parts = routePath.split('/')
  const filteredParts = parts.filter(part => part && part !== parts[parts.length - 1])

  return `/${filteredParts.join('/')}`
}
