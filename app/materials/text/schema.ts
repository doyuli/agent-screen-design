import type { MaterialDefinition } from '~~/shared/schema/material'
import { TextIcon } from '@lucide/vue'

export const textMaterialSchema: MaterialDefinition = {
  name: 'text',
  group: 'basics',
  icon: TextIcon,
  schema: {
    type: 'text',
    name: '普通文本',
    description: '基础',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 300,
      height: 50,
      lockRatio: false,
    },
    style: {
      color: '#fff',
      fontSize: 16,
    },
    props: {
      content: 'hello world',
    },
  },
}
