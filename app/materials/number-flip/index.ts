import type { MaterialSchema } from '~~/shared/schema/material'
import type { RegisterFunction } from '..'
import { computed, defineComponent, h } from 'vue'
import { useDataSource } from '@/composables/data-source'
import { formatCountUpValue, useCountUp } from '../_shared/count-up'
import { ensureNumber } from '../_shared/data'
import { numberFlipMaterialSchema } from './schema'

export const NumberFlipMaterial = defineComponent({
  name: 'NumberFlipMaterial',
  props: ['schema'],
  setup(props: { schema: MaterialSchema }) {
    const dataSourceId = computed(() => props.schema.dataSourceId)
    const { data: dataSourceData } = useDataSource(dataSourceId)

    const targetValue = computed(() => ensureNumber(dataSourceData.value, Number(props.schema.props?.value ?? 0)))

    const duration = computed(() => Number(props.schema.props?.duration ?? 1000))
    const transitioned = useCountUp(targetValue, duration)

    const displayText = computed(() => {
      const p = props.schema.props ?? {}
      const decimals = Number(p.decimals ?? 0)
      const prefix = String(p.prefix ?? '')
      const suffix = String(p.suffix ?? '')

      return `${prefix}${formatCountUpValue(transitioned.value, decimals, !!p.separator)}${suffix}`
    })

    const style = computed(() => {
      const s = props.schema.style ?? {}
      return {
        ...s,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${s.fontSize ?? 40}px`,
        fontVariantNumeric: 'tabular-nums',
      }
    })

    return () => h('div', { style: style.value }, displayText.value)
  },
})

export function install(register: RegisterFunction) {
  register(numberFlipMaterialSchema, NumberFlipMaterial)
}

export default NumberFlipMaterial
