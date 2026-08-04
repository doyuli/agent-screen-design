export function serializeJson(value: unknown, fallback: string = 'null') {
  return JSON.stringify(value, null, 2) ?? fallback
}

export function safeJsonParse(value: string) {
  try {
    return { success: true, value: JSON.parse(value) }
  }
  catch {
    return { success: false, value: undefined }
  }
}

export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function parseOptionalObjectJson(value: string) {
  if (!value.trim())
    return { success: true, value: undefined }

  const result = safeJsonParse(value)
  if (!result.success)
    return result

  if (!isObjectRecord(result.value)) {
    return { success: false, value: undefined }
  }

  return { success: true, value: result.value }
}
