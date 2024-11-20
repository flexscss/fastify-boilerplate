export function buildWhereClause(query, excludeFields = ['limit', 'offset', 'orderBy']) {
  const where = {}

  Object.entries(query).forEach(([key, value]) => {
    if (excludeFields.includes(key))
      return

    if (value) {
      where[key] = { contains: value, mode: 'insensitive' }
    }
  })

  return where
}

export function parseOrderBy(orderByString) {
  if (!orderByString)
    return { createdAt: 'desc' }

  const [field, direction] = orderByString.split(':')
  return { [field]: direction?.toLowerCase() === 'desc' ? 'desc' : 'asc' }
}

export function getPaginationData({ total, offset = 0, limit = 10, itemsLength }) {
  return {
    total,
    offset: Number(offset),
    limit: Number(limit),
    hasMore: total > Number(offset) + itemsLength
  }
}
