type WorkerLoader = () => Promise<{ default: new () => Worker }>

const workers: Record<string, WorkerLoader> = {
  json: () => import('monaco-editor/language/json/json.worker.js?worker'),
  css: () => import('monaco-editor/language/css/css.worker.js?worker'),
  html: () => import('monaco-editor/language/html/html.worker.js?worker'),
  typescript: () => import('monaco-editor/language/typescript/ts.worker.js?worker'),
  javascript: () => import('monaco-editor/language/typescript/ts.worker.js?worker'),
  editor: () => import('monaco-editor/editor/editor.worker.js?worker'),
}

const cache = new Map<string, Promise<any>>()

function loadWorker(label: string) {
  if (!cache.has(label)) {
    const key = workers[label] ? label : 'editor'
    cache.set(label, workers[key]!())
  }

  return cache.get(label)
}

export default defineNuxtPlugin(() => {
  globalThis.MonacoEnvironment = {
    async getWorker(_, label) {
      const { default: Worker } = await loadWorker(label)

      return new Worker()
    },
  }
})
