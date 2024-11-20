import fs from 'node:fs/promises'
import path from 'node:path'
import { findFiles } from '../utils/file-utils.mjs'

export async function findControllerFile(handler, projectRoot) {
  const controllersDir = path.join(projectRoot, 'controllers')
  const files = await findFiles(controllersDir, '.mjs')

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    if (content.includes(`export const ${handler}`)) {
      return file
    }
  }
  return null
}

export async function findPrismaModel(controllerFile, projectRoot) {
  if (!controllerFile)
    return null

  const content = await fs.readFile(controllerFile, 'utf-8')
  const modelUsage = countModelUsage(content)

  if (modelUsage.size > 0) {
    return getMostUsedModel(modelUsage)
  }

  const repoModel = await checkRepositoryUsage(controllerFile, projectRoot)
  return repoModel
}

function countModelUsage(content) {
  const modelUsage = new Map()
  const modelMatches = [...content.matchAll(/prisma\.(\w+)\./g)]

  modelMatches.forEach((match) => {
    const model = match[1]
    modelUsage.set(model, (modelUsage.get(model) || 0) + 1)
  })

  return modelUsage
}

function getMostUsedModel(modelUsage) {
  return [...modelUsage.entries()]
    .sort((a, b) => b[1] - a[1])[0][0]
}

async function checkRepositoryUsage(controllerFile, projectRoot) {
  const content = await fs.readFile(controllerFile, 'utf-8')
  const repoImports = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]#repositories\/(\w+)\.mjs['"]/i)

  if (!repoImports)
    return null

  const repoFile = path.join(projectRoot, 'repositories', `${repoImports[2]}.mjs`)

  try {
    const repoContent = await fs.readFile(repoFile, 'utf-8')
    const modelUsage = countModelUsage(repoContent)
    return modelUsage.size > 0 ? getMostUsedModel(modelUsage) : null
  }
  catch (error) {
    console.warn(`Warning: Could not read repository file ${repoFile}:`, error.message)
    return null
  }
}
