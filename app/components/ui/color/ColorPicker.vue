<script setup lang="ts">
import type { Color } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldInput,
  ColorFieldRoot,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatch,
  colorToString,
  isValidColor,
  normalizeColor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const modelValue = defineModel<string>({ default: '#000000' })

const color = computed<Color>({
  get: () => {
    const value = modelValue.value
    return isValidColor(value) ? normalizeColor(value) : normalizeColor('#000000')
  },
  set: value => (modelValue.value = colorToString(value, 'hex')),
})

const hexColor = computed(() => colorToString(color.value, 'hex'))

function handleColorUpdate(value: Color) {
  color.value = value
}

function handleHexUpdate(value: string) {
  if (isValidColor(value))
    color.value = normalizeColor(value)
}

function handleOpenChange(open: boolean) {
  if (open)
    emits('focus')
  else
    emits('blur')
}
</script>

<template>
  <PopoverRoot @update:open="handleOpenChange">
    <PopoverTrigger
      data-slot="color-picker-trigger"
      v-bind="$attrs"
      :disabled="disabled"
      :class="cn(
        'border-input bg-transparent hover:bg-accent/50 flex h-9 w-full min-w-0 items-center gap-2 rounded-md border px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )"
    >
      <ColorSwatch
        :color="color"
        class="size-4 shrink-0 rounded border border-foreground/15"
        :style="{ backgroundColor: 'var(--reka-color-swatch-color)' }"
      />
      <span class="min-w-0 truncate font-mono text-sm">{{ hexColor }}</span>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="4"
        class="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 z-50 w-72 origin-(--reka-popover-content-transform-origin) rounded-md border p-3 shadow-md outline-none"
      >
        <div class="space-y-3">
          <ColorAreaRoot
            v-slot="{ style }"
            :model-value="color"
            color-space="hsl"
            x-channel="saturation"
            y-channel="lightness"
            @update:color="handleColorUpdate"
          >
            <ColorAreaArea
              class="relative h-36 w-full overflow-hidden rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              :style="style"
            >
              <ColorAreaThumb class="block size-4 cursor-pointer rounded-full border-2 border-white shadow-sm outline-1 outline-black/20 transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50" />
            </ColorAreaArea>
          </ColorAreaRoot>

          <div class="space-y-2">
            <ColorSliderRoot
              :model-value="color"
              channel="hue"
              color-space="hsl"
              class="relative flex h-4 w-full items-center"
              @update:color="handleColorUpdate"
            >
              <ColorSliderTrack class="h-2 flex-1 overflow-hidden rounded-full" />
              <ColorSliderThumb class="block size-4 cursor-pointer rounded-full border-2 border-white bg-background shadow-sm outline-1 outline-black/20 transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50" />
            </ColorSliderRoot>

            <ColorSliderRoot
              :model-value="color"
              channel="alpha"
              color-space="hsl"
              class="relative flex h-4 w-full items-center"
              @update:color="handleColorUpdate"
            >
              <ColorSliderTrack class="h-2 flex-1 overflow-hidden rounded-full" />
              <ColorSliderThumb class="block size-4 cursor-pointer rounded-full border-2 border-white bg-background shadow-sm outline-1 outline-black/20 transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50" />
            </ColorSliderRoot>
          </div>

          <ColorFieldRoot
            :model-value="hexColor"
            @update:model-value="handleHexUpdate"
          >
            <ColorFieldInput
              class="border-input bg-transparent placeholder:text-muted-foreground h-8 w-full rounded-md border px-2 font-mono text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="#000000"
            />
          </ColorFieldRoot>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
