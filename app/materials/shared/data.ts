export function ensureNumber(data: unknown, fallback: number = 0) {
  return typeof data === 'number' && Number.isFinite(data) ? data : fallback
}

export function ensureArray<T>(data: unknown, fallback: T[] = []) {
  return Array.isArray(data) ? data : fallback
}

export function ensureRecord<T extends Record<string, unknown>>(data: unknown, fallback: T = {} as T) {
  return isRecord(data) ? data : fallback
}

export function isRecord<T extends Record<string, unknown>>(data: unknown): data is T {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}
