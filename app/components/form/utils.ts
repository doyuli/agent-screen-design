export function getValue(target: Record<string, any>, key: string) {
  if (!key)
    return target

  const keys = key.split('.')
  while (keys.length) {
    const shiftKey = keys.shift()!
    target = target[shiftKey]
  }
  return target
}

export function setValue(target: Record<string, any>, key: string, value: any) {
  const keys = key.split('.')
  const lastKey = keys.pop()!
  if (keys.length) {
    target = getValue(target, keys.join('.'))
  }
  target[lastKey] = value
}
