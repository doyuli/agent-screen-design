export function getValue(target: Record<string, unknown>, key: string) {
  if (!key)
    return target

  const keys = key.split('.')
  while (keys.length) {
    const shiftKey = keys.shift()!
    target = target[shiftKey] as Record<string, unknown>
  }
  return target
}

export function setValue(target: Record<string, unknown>, key: string, value: unknown) {
  const keys = key.split('.')
  const lastKey = keys.pop()!
  if (keys.length) {
    target = getValue(target, keys.join('.'))
  }
  target[lastKey] = value
}

export function deepClone<T>(val: T) {
  if (typeof val !== 'object' || val === null)
    return val
  return JSON.parse(JSON.stringify(val))
}
