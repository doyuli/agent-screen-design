import { typescript } from 'monaco-editor'

const libSource = `
interface ScreenRuntimeContext {
  getNode(id: string): MaterialSchema | undefined
  setAttribute(id: string, key: string, value: unknown): void
  setProp(id: string, key: string, value: unknown): void
  setStyle(id: string, key: string, value: unknown): void
  invoke(id: string, name: string, ...args: unknown[]): void
  dispatch(id: string, name: string, payload?: unknown): void
}

interface MaterialSchema {
  id: string
  name: string
  type: string
}

declare const $context: ScreenRuntimeContext
declare const $node: MaterialSchema
declare const $payload: unknown
`

let registered = false

export function registerMonacoRuntimeTypes() {
  if (registered)
    return

  registered = true
  typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })

  typescript.javascriptDefaults.setCompilerOptions({
    target: typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
  })

  typescript.javascriptDefaults.addExtraLib(libSource, 'ts:filename/screen-runtime.d.ts')
}
