import { z } from 'zod'

export function serializeJson(value: unknown, fallback: string = 'null') {
  try {
    return value === undefined ? fallback : JSON.stringify(value, null, 2)
  }
  catch {
    return fallback
  }
}

export function safeJsonParse(value: string) {
  try {
    return { success: true as const, data: JSON.parse(value), error: undefined }
  }
  catch {
    const error = new z.ZodError([{ code: 'invalid_type', message: 'Invalid JSON', path: [], expected: 'string' }])
    return { success: false as const, data: undefined, error }
  }
}

export function parseJsonWithSchema(value: string, schema: z.ZodType) {
  if (!value.trim()) {
    return schema.safeParse(undefined)
  }

  const parsed = safeJsonParse(value)
  if (!parsed.success)
    return parsed

  return schema.safeParse(parsed.data)
}
