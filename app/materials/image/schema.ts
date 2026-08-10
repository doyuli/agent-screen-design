import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { ImageIcon } from '@lucide/vue'

export const imageMaterialSchema: MaterialDefinitionSchema = {
  name: 'image',
  group: 'media',
  icon: ImageIcon,
  schema: {
    type: 'image',
    name: '图片',
    description: '媒体',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      lockRatio: false,
    },
    style: {
      opacity: 1,
    },
    props: {
      src: '',
      fit: 'contain',
      radius: 0,
    },
  },
  fields: [
    {
      key: 'props.src',
      label: '图片地址',
      type: 'input',
    },
    {
      key: 'props.fit',
      label: '填充方式',
      type: 'select',
      props: {
        options: [
          { label: '包含', value: 'contain' },
          { label: '覆盖', value: 'cover' },
          { label: '拉伸', value: 'fill' },
          { label: '原始', value: 'none' },
          { label: '缩放适应', value: 'scale-down' },
        ],
      },
    },
    {
      key: 'props.radius',
      label: '圆角',
      type: 'number',
      span: 12,
    },
    {
      key: 'style.opacity',
      label: '透明度',
      type: 'number',
      span: 12,
    },
  ],
}
