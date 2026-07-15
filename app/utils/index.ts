export function deepClone<T>(val: T) {
  if (typeof val !== 'object' || val === null)
    return val
  return JSON.parse(JSON.stringify(val))
}
