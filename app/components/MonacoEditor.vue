<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { editor } from 'monaco-editor'
import { cn } from '@/lib/utils'

interface EditorProps {
  class?: HTMLAttributes['class']
  language?: string
  monacoOptions?: editor.IStandaloneEditorConstructionOptions
}

const props = withDefaults(defineProps<EditorProps>(), {
  language: 'json',
})

const editorRoot = useTemplateRef<HTMLElement>('editor-root')

let instance: editor.IStandaloneCodeEditor | null = null

const modelValue = defineModel<string>('modelValue', { required: true })

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: 'off',
  scrollBeyondLastLine: false,
  minimap: { enabled: false },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  scrollbar: { verticalScrollbarSize: 8 },
  automaticLayout: true,
}

onMounted(() => {
  instance = editor.create(editorRoot.value!, {
    ...defaultOptions,
    ...props.monacoOptions,
    language: props.language,
    value: modelValue.value,
  })

  instance.onDidChangeModelContent(() => {
    modelValue.value = instance?.getValue() ?? ''
  })

  watch(
    modelValue,
    (value) => {
      if (value === instance?.getValue())
        return

      instance?.setValue(value)
    },
  )

  onUnmounted(() => {
    instance?.dispose()
  })
})

defineExpose({
  getInstance: () => instance,
})
</script>

<template>
  <div ref="editor-root" :class="cn('size-full', props.class)" />
</template>
