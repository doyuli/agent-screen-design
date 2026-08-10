import type { MaterialSchema } from '~~/shared/schema/material'
import type { RegisterFunction } from '..'
import { computed, defineComponent, h } from 'vue'
import { imageMaterialSchema } from './schema'

const Placeholder = h(
  'div',
  {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      color: '#64748b',
      fontSize: '14px',
      border: '1px dashed #475569',
    },
  },
  '未设置图片',
)

export const ImageMaterial = defineComponent({
  name: 'ImageMaterial',
  props: ['schema'],
  setup(props: { schema: MaterialSchema }) {
    const containerStyle = computed(() => {
      const s = props.schema.style ?? {}
      return {
        ...s,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }
    })

    const imageStyle = computed(() => {
      const p = props.schema.props ?? {}
      return {
        width: '100%',
        height: '100%',
        objectFit: (p.fit ?? 'contain') as 'contain',
        borderRadius: `${p.radius ?? 0}px`,
      }
    })

    return () => {
      const src = String(props.schema.props?.src ?? '')
      return h('div', { style: containerStyle.value }, [
        src ? h('img', { src, style: imageStyle.value, alt: '' }) : Placeholder,
      ])
    }
  },
})

export function install(register: RegisterFunction) {
  register(imageMaterialSchema, ImageMaterial)
}

export default ImageMaterial
