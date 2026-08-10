import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { TextIcon } from '@lucide/vue'

export const textMaterialSchema: MaterialDefinitionSchema = {
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
      fontWeight: '400',
      textAlign: 'left',
      lineHeight: 1.5,
      letterSpacing: 0,
      background: 'transparent',
    },
    props: {
      content: 'hello world',
    },
  },
  fields: [
    {
      key: 'props.content',
      label: '内容',
      type: 'input',
    },
    {
      key: 'style.color',
      label: '颜色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.background',
      label: '背景色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.fontSize',
      label: '字号',
      type: 'number',
      span: 12,
    },
    {
      key: 'style.fontWeight',
      label: '字重',
      type: 'select',
      span: 12,
      props: {
        options: [
          { label: '常规', value: '400' },
          { label: '中等', value: '500' },
          { label: '半粗', value: '600' },
          { label: '加粗', value: '700' },
        ],
      },
    },
    {
      key: 'style.textAlign',
      label: '对齐',
      type: 'select',
      span: 12,
      props: {
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
    },
    {
      key: 'style.lineHeight',
      label: '行高',
      type: 'number',
      span: 12,
    },
    {
      key: 'style.letterSpacing',
      label: '字间距',
      type: 'number',
      span: 12,
    },
  ],
}
