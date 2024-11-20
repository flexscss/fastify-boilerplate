import fs from 'node:fs/promises'
import path from 'node:path'

export async function parsePrismaSchema(projectRoot) {
  const schemaPath = path.join(projectRoot, '..', 'prisma', 'schema.prisma')
  const content = await fs.readFile(schemaPath, 'utf-8')

  const models = []
  let currentModel = null
  let currentFields = {}

  const lines = content.split('\n')
  for (const line of lines) {
    const trimmedLine = line.trim()

    if (isModelDeclaration(trimmedLine)) {
      currentModel = extractModelName(trimmedLine)
      currentFields = {}
      continue
    }

    if (currentModel && isValidFieldLine(trimmedLine)) {
      const [fieldName, fieldInfo] = parseField(trimmedLine)
      if (fieldName && Object.keys(fieldInfo).length > 0) {
        currentFields[fieldName] = fieldInfo
      }
    }

    if (isModelEnd(trimmedLine) && currentModel) {
      models.push({
        modelName: currentModel,
        fields: currentFields
      })
      currentModel = null
      currentFields = {}
    }
  }

  return models
}

function isModelDeclaration(line) {
  return line.match(/^model\s+(\w+)\s*\{/)
}

function extractModelName(line) {
  return line.match(/^model\s+(\w+)\s*\{/)[1]
}

function isValidFieldLine(line) {
  return line && !line.startsWith('//') && line !== '}'
}

function isModelEnd(line) {
  return line === '}'
}

function parseField(line) {
  const fieldMatch = line.match(/^(\w+)\s(.+)$/)
  if (!fieldMatch)
    return []

  const [, fieldName, fieldDef] = fieldMatch
  const fieldInfo = parseFieldDefinition(fieldDef)

  return [fieldName, fieldInfo]
}

function parseFieldDefinition(fieldDef) {
  const info = {}

  if (!fieldDef.includes('?'))
    info.required = true
  if (fieldDef.includes('@unique'))
    info.unique = true

  setFieldType(info, fieldDef)
  handleArrayType(info, fieldDef)

  return info
}

function setFieldType(info, fieldDef) {
  if (fieldDef.includes('@id') && fieldDef.includes('@db.ObjectId')) {
    info.type = 'string'
  }
  else if (fieldDef.startsWith('String')) {
    info.type = 'string'
  }
  else if (fieldDef.startsWith('Int')) {
    info.type = 'number'
  }
  else if (fieldDef.startsWith('DateTime')) {
    info.type = 'date'
  }
  else if (fieldDef.startsWith('Boolean')) {
    info.type = 'boolean'
  }
  else {
    handleRelationType(info, fieldDef)
  }
}

function handleRelationType(info, fieldDef) {
  const relationMatch = fieldDef.match(/(\w+)(\?)?\s*@relation/)
  if (relationMatch) {
    info.type = 'object'
    info.relation = relationMatch[1]
    return
  }

  const typeMatch = fieldDef.match(/^(\w+)(\?)?(\[\])?/)
  if (typeMatch && /^[A-Z]/.test(typeMatch[1])) {
    info.type = typeMatch[3] ? 'array' : 'object'
    info.relation = typeMatch[1]
  }
}

function handleArrayType(info, fieldDef) {
  if (fieldDef.includes('[]')) {
    info.type = 'array'
    if (info.relation) {
      info.items = {
        type: 'object',
        relation: info.relation
      }
      delete info.relation
    }
  }
}
