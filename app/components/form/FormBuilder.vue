<script setup lang="ts">
import type { FieldSchema, MaterialSchema } from '~~/shared/schema/material'
import { Label } from '@/components/ui/label'
import { getComponent } from './register'
import { getValue, setValue } from './utils'

defineProps<{
  fields: FieldSchema[]
  formData: MaterialSchema
}>()

function getGridColumn(span?: number) {
  const columnSpan = span || 24
  return `span ${columnSpan} / span ${columnSpan}`
}

function shouldShowLabel(field: FieldSchema) {
  return field.type !== 'separator'
}

function shouldWithBackground(field: FieldSchema) {
  return field.type === 'checkbox' || field.type === 'switch'
}
</script>

<template>
  <div class="grid grid-cols-24 gap-3">
    <div
      v-for="(field, index) in fields"
      :key="`${field.key}-${index}`"
      :class="shouldWithBackground(field) ? 'flex items-center justify-between rounded-md border bg-background px-3 py-2' : 'space-y-2'"
      :style="{ gridColumn: getGridColumn(field.span) }"
    >
      <Label v-if="shouldShowLabel(field)" :for="field.key" :class="{ 'text-sm': shouldWithBackground(field) }">
        {{ field.label }}
      </Label>
      <component
        :is="getComponent(field.type)"
        :id="field.key"
        v-bind="field.props"
        :model-value="getValue(formData, field.key)"
        @update:model-value="(val: any) => {
          setValue(formData, field.key, val)
        }"
      />
    </div>
  </div>
</template>
