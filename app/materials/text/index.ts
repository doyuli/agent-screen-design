import type { MaterialSchema } from '~~/shared/schema/material'
import type { RegisterFunction } from '..'
import { computed, defineComponent, h } from 'vue'
import { textMaterialSchema } from './schema'

export const TextMaterial = defineComponent({
  name: 'TextMaterial',
  props: ['schema'],
  setup(props: { schema: MaterialSchema }) {
    const style = computed(() => {
      const s = props.schema.style ?? {}
      return {
        ...s,
        fontSize: `${s.fontSize ?? 16}px`,
        letterSpacing: `${s.letterSpacing ?? 0}px`,
      }
    })
    return () => h('div', { style: style.value }, String(props.schema.props?.content ?? ''))
  },
})

export function install(register: RegisterFunction) {
  register(textMaterialSchema, TextMaterial)
}

export default TextMaterial
