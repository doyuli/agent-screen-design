<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor.vue'
import { cn } from '@/lib/utils'
import { safeJsonParse, serializeJson } from '~/utils/parser'

const emit = defineEmits<{
  focus: []
  blur: []
}>()

const modelValue = defineModel<unknown>({ required: true })

const editorRef = useTemplateRef<InstanceType<typeof MonacoEditor>>('editor')

const text = ref('')
let focused = false
let focusDisposable: { dispose: () => void } | undefined
let blurDisposable: { dispose: () => void } | undefined

const draft = computed(() => safeJsonParse(text.value))
const invalid = computed(() => !draft.value.success)
const errorMessage = computed(() => draft.value.success ? '' : draft.value.error.issues[0]?.message ?? 'JSON 格式错误')

function commitDraft() {
  if (draft.value.success)
    modelValue.value = draft.value.data
}

watch(
  modelValue,
  (value) => {
    if (focused)
      return

    if (draft.value.success && serializeJson(draft.value.data) === serializeJson(value))
      return

    text.value = value === undefined || value === null ? '' : serializeJson(value, '')
  },
  { immediate: true },
)

onMounted(() => {
  const instance = editorRef.value?.getInstance()

  focusDisposable = instance?.onDidFocusEditorWidget(() => {
    focused = true
    emit('focus')
  })

  blurDisposable = instance?.onDidBlurEditorWidget(() => {
    focused = false
    commitDraft()
    emit('blur')
  })
})

onBeforeUnmount(() => {
  focusDisposable?.dispose()
  blurDisposable?.dispose()
})
</script>

<template>
  <div
    :class="cn('flex flex-col overflow-hidden rounded-md border bg-background py-2 h-40', invalid && 'border-destructive')"
    :title="invalid ? errorMessage : undefined"
  >
    <div class="min-h-0 flex-1">
      <MonacoEditor
        ref="editor"
        v-model="text"
        language="json"
        :monaco-options="{ stickyScroll: { enabled: false } }"
      />
    </div>
    <p v-if="invalid" class="shrink-0 px-3 pt-2 text-xs text-destructive" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
