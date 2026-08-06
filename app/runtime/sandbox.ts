const GLOBAL_WHITELIST = new Set([
  'console',
  'Promise',
  'setTimeout',
  'clearTimeout',
  'JSON',
  'Math',
  'Date',
])

export function runSandbox(code: string, scope: Record<string, unknown>) {
  const sandbox = createSandbox(scope)

  // eslint-disable-next-line no-new-func
  const fn = new Function(
    'sandbox',
    `
    const asyncFn = async () => {
       with (sandbox) {
       ${code}
      }
    }
    return asyncFn()
`,
  )

  return fn(sandbox)
}

function createSandbox(scope: Record<string, unknown>) {
  return new Proxy(scope, {
    has() {
      return true
    },
    get(target, key) {
      if (key === Symbol.unscopables)
        return undefined

      if (typeof key !== 'string')
        return undefined

      if (Object.hasOwn(target, key))
        return target[key]

      if (GLOBAL_WHITELIST.has(key))
        return globalThis[key as keyof typeof globalThis]

      return undefined
    },
  })
}
