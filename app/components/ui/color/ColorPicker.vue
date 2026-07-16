<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ColorFieldInput, ColorFieldRoot } from 'reka-ui'

const props = defineProps<{
  id: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const modelValue = useVModel(props, 'modelValue', emit, { passive: true })

function updateColor(value: string) {
  modelValue.value = value.slice(0, 7).toUpperCase()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="relative size-9 shrink-0 overflow-hidden rounded-md border shadow-xs">
      <span class="absolute inset-0" :style="{ backgroundColor: modelValue }" />
      <input
        :id="id"
        type="color"
        :value="modelValue"
        class="absolute inset-0 size-full cursor-pointer opacity-0"
        aria-label="选择颜色"
        @change="updateColor(($event.target as HTMLInputElement).value)"
      >
    </div>

    <ColorFieldRoot class="w-full" :model-value="modelValue" @update:model-value="updateColor">
      <ColorFieldInput
        :aria-label="`${id} HEX 值`"
        class="border-input bg-transparent font-mono h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm uppercase shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3"
      />
    </ColorFieldRoot>
  </div>
</template>
