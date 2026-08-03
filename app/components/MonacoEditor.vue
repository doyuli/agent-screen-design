<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { editor } from 'monaco-editor'
import { cn } from '@/lib/utils'

interface EditorProps extends Omit<editor.IStandaloneEditorConstructionOptions, 'value'> {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<EditorProps>(), {
  language: 'json',
  automaticLayout: true,
  lineNumbers: 'off',
  scrollBeyondLastLine: false,
  minimap: () => ({
    enabled: false,
  }),
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  scrollbar: () => ({
    verticalScrollbarSize: 8,
  }),
})

const editorRoot = useTemplateRef<HTMLElement>('editor-root')

let instance: editor.IStandaloneCodeEditor | null = null

const modelValue = defineModel<string>('modelValue', { required: true })

onMounted(() => {
  instance = editor.create(
    editorRoot.value!,
    {
      value: modelValue.value,
      ...props,
    },
  )

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
