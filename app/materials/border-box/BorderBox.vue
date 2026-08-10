<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'

const props = defineProps<{
  schema: MaterialSchema
}>()

const variant = computed(() => String(props.schema.props?.variant ?? 'classic'))

const rootStyle = computed(() => ({
  '--bb-color': String(props.schema.props?.color ?? '#22d3ee'),
  '--bb-bg': String(props.schema.props?.backgroundColor ?? 'transparent'),
}))
</script>

<template>
  <div
    class="relative size-full bg-(--bb-bg)"
    :class="variant === 'tech' ? 'border border-[color-mix(in_srgb,var(--bb-color)_25%,transparent)]' : 'border border-(--bb-color)'"
    :style="rootStyle"
  >
    <template v-if="variant === 'tech'">
      <span class="absolute -top-0.5 -left-0.5 size-5 border-solid border-t-[3px] border-l-[3px] border-(--bb-color)" />
      <span class="absolute -top-0.5 -right-0.5 size-5 border-solid border-t-[3px] border-r-[3px] border-(--bb-color)" />
      <span class="absolute -right-0.5 -bottom-0.5 size-5 border-solid border-r-[3px] border-b-[3px] border-(--bb-color)" />
      <span class="absolute -bottom-0.5 -left-0.5 size-5 border-solid border-b-[3px] border-l-[3px] border-(--bb-color)" />
    </template>
    <template v-else>
      <span class="absolute -top-px -left-px size-0 border-solid border-t-12 border-r-12 border-t-(--bb-color) border-r-transparent" />
      <span class="absolute -top-px -right-px size-0 border-solid border-r-12 border-b-12 border-r-(--bb-color) border-b-transparent" />
      <span class="absolute -right-px -bottom-px size-0 border-solid border-b-12 border-l-12 border-b-(--bb-color) border-l-transparent" />
      <span class="absolute -bottom-px -left-px size-0 border-solid border-t-12 border-l-12 border-l-(--bb-color) border-t-transparent" />
    </template>
  </div>
</template>
