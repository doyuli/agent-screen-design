import type { PageSchema } from '~~/shared/schema/page'
import { onScopeDispose, ref, watch } from 'vue'
import { deepClone } from '~/utils'

export type ScreenSaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

interface ScreenAutoSaveOptions {
  force?: boolean
}

const AUTO_SAVE_DELAY = 5000

export function useScreenAutoSave() {
  const saveState = ref<ScreenSaveState>('idle')
  const lastSavedAt = ref<Date>()

  const editorStore = useEditorStore()
  const { pageSchema } = storeToRefs(editorStore)

  let lastSavedSnapshot = serialize(pageSchema.value)
  let timer: ReturnType<typeof setTimeout> | undefined
  let savingPromise: Promise<boolean> | undefined

  function scheduleSave() {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(save, AUTO_SAVE_DELAY)
  }

  async function save(options?: ScreenAutoSaveOptions) {
    const { force = false } = options || {}

    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }

    if (savingPromise)
      return savingPromise

    if (!force && serialize(pageSchema.value) === lastSavedSnapshot)
      return true

    const snapshot = deepClone(pageSchema.value)
    saveState.value = 'saving'

    savingPromise = $fetch('/api/screen/publish', {
      method: 'POST',
      body: snapshot,
    })
      .then((savedSchema) => {
        if (!snapshot.id) {
          snapshot.id = savedSchema.id
          editorStore.updatePageSchema({ id: savedSchema.id })
        }

        lastSavedSnapshot = serialize(snapshot)
        lastSavedAt.value = new Date()
        saveState.value = serialize(pageSchema.value) === lastSavedSnapshot ? 'saved' : 'dirty'
        return true
      })
      .catch(() => {
        saveState.value = 'error'
        return false
      })
      .finally(() => {
        savingPromise = undefined

        if (saveState.value === 'dirty')
          scheduleSave()
      })

    return savingPromise
  }

  watch(
    pageSchema,
    () => {
      if (serialize(pageSchema.value) === lastSavedSnapshot)
        return

      if (saveState.value !== 'saving')
        saveState.value = 'dirty'

      scheduleSave()
    },
    { deep: true },
  )

  onScopeDispose(() => {
    if (timer)
      clearTimeout(timer)
  })

  return {
    saveState,
    lastSavedAt,
    flushSave: () => save({ force: true }),
  }
}

function serialize(schema: PageSchema) {
  return JSON.stringify(schema)
}
