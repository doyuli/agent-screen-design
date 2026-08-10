import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { FrameIcon } from '@lucide/vue'

export const borderBoxMaterialSchema: MaterialDefinitionSchema = {
  name: 'border-box',
  group: 'decorations',
  icon: FrameIcon,
  schema: {
    type: 'border-box',
    name: '边框容器',
    description: '装饰',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 420,
      height: 300,
      lockRatio: false,
    },
    props: {
      variant: 'classic',
      color: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.04)',
    },
  },
  fields: [
    {
      key: 'props.variant',
      label: '款式',
      type: 'select',
      props: {
        options: [
          { label: '四角斜切', value: 'classic' },
          { label: '科技拐角', value: 'tech' },
        ],
      },
    },
    {
      key: 'props.color',
      label: '边框色',
      type: 'color',
      span: 12,
    },
    {
      key: 'props.backgroundColor',
      label: '背景色',
      type: 'color',
      span: 12,
    },
  ],
}
