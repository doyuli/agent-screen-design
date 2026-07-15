import type { Component } from 'vue'
import { h } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { ColorPicker } from '@/components/ui/color'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import FormSelect from './components/FormSelect.vue'

const COMPONENT_MAP = new Map<string, Component>([
  ['input', Input],
  ['color', ColorPicker],
  ['number', (props, { slots }) => h(Input, { type: 'number', ...props }, slots)],
  ['switch', Switch],
  ['select', FormSelect],
  ['checkbox', Checkbox],
  ['separator', Separator],
])

export function register(name: string, component: Component) {
  COMPONENT_MAP.set(name, component)
}

export function getComponent(name: string) {
  return COMPONENT_MAP.get(name)
}
