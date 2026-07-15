<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectOption {
  label: string
  value: string
}

type FormSelectProps = SelectRootProps & {
  options: SelectOption[]
  placeholder?: string
}

const props = defineProps<FormSelectProps>()
const emits = defineEmits<SelectRootEmits>()

const delegatedProps = reactiveOmit(props, 'options', 'placeholder')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Select v-bind="forwarded">
    <SelectTrigger class="w-full">
      <SelectValue :placeholder="placeholder || '请选择'" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
