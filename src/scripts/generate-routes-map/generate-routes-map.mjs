import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findControllerFile, findPrismaModel } from './parsers/controller-parser.mjs'
import { parsePrismaSchema } from './parsers/prisma-parser.mjs'
import { parseRouteFile } from './parsers/route-parser.mjs'
import { findFiles } from './utils/file-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..')

const EXCLUDED_FOLDERS = [
  'auth'
]

async function generateRoutesMap() {
  const routesDir = path.join(PROJECT_ROOT, 'routes')
  const routeFiles = await findFiles(routesDir, '.mjs', EXCLUDED_FOLDERS)

  const mappings = await generateMappings(routeFiles)
  const models = await parsePrismaSchema(PROJECT_ROOT)

  await writeRoutesMap(mappings, models)

  console.log('Routes map generated successfully!')
}

async function generateMappings(routeFiles) {
  const mappings = []

  for (const routeFile of routeFiles) {
    const routes = await parseRouteFile(routeFile)

    for (const route of routes) {
      const controllerFile = await findControllerFile(route.handler, PROJECT_ROOT)
      const model = await findPrismaModel(controllerFile, PROJECT_ROOT)

      if (model) {
        mappings.push({
          path: route.route,
          model: model.toLowerCase(),
          method: route.method.toUpperCase()
        })
      }
    }
  }

  return mappings
}

async function writeRoutesMap(mappings, models) {
  const output = formatOutput(mappings, models)

  await fs.writeFile(
    path.join(PROJECT_ROOT, '../dashboard/src/data/routes-map.js'),
    output
  )
}

function formatOutput(mappings, models) {
  return `export const apiMap = {
  models: [${formatObject(models).slice(1, -1)}
  ],
  routes: [${formatObject(mappings).slice(1, -1)}
  ]
}\n`
}

function formatObject(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"([^"]+)"/g, '\'$1\'')
    .split('\n')
    .map(line => line.replace(/^ {2}/, '    '))
    .join('\n')
}

generateRoutesMap().catch(console.error)
