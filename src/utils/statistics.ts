export function countByStatus<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T = 'status' as keyof T,
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const item of items) {
    const val = String(item[key] ?? 'unknown')
    result[val] = (result[val] ?? 0) + 1
  }
  return result
}

export function countByField<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const item of items) {
    const val = String(item[field] ?? '未知')
    result[val] = (result[val] ?? 0) + 1
  }
  return result
}

export function getMostCommon<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
): string {
  const counts = countByField(items, field)
  let max = 0
  let maxKey = ''
  for (const [key, count] of Object.entries(counts)) {
    if (count > max) {
      max = count
      maxKey = key
    }
  }
  return maxKey || ''
}

export function averagePrice<T extends Record<string, unknown>>(
  items: T[],
  priceField: keyof T = 'price' as keyof T,
): number {
  if (items.length === 0) return 0
  const total = items.reduce((sum, item) => {
    const price = Number(item[priceField]) || 0
    return sum + price
  }, 0)
  return Math.round((total / items.length) * 100) / 100
}
