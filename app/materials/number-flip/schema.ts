import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { HashIcon } from '@lucide/vue'

export const numberFlipMaterialSchema: MaterialDefinitionSchema = {
  name: 'number-flip',
  group: 'basics',
  icon: HashIcon,
  schema: {
    type: 'number-flip',
    name: '数字翻牌器',
    description: '基础',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 260,
      height: 80,
      lockRatio: false,
    },
    style: {
      color: '#22d3ee',
      fontSize: 40,
      fontWeight: '700',
    },
    props: {
      value: 12345,
      decimals: 0,
      separator: true,
      prefix: '',
      suffix: '',
      duration: 1000,
    },
  },
  fields: [
    {
      key: 'props.value',
      label: '数值',
      type: 'number',
    },
    {
      key: 'props.decimals',
      label: '保留小数位',
      type: 'number',
      span: 12,
    },
    {
      key: 'props.duration',
      label: '动画时长(ms)',
      type: 'number',
      span: 12,
    },
    {
      key: 'props.prefix',
      label: '前缀',
      type: 'input',
      span: 12,
    },
    {
      key: 'props.suffix',
      label: '后缀',
      type: 'input',
      span: 12,
    },
    {
      key: 'props.separator',
      label: '千分位',
      type: 'switch',
      span: 24,
    },
    {
      key: '',
      label: '',
      type: 'separator',
    },
    {
      key: 'style.color',
      label: '颜色',
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
      props: {
        options: [
          { label: '常规', value: '400' },
          { label: '中等', value: '500' },
          { label: '半粗', value: '600' },
          { label: '加粗', value: '700' },
        ],
      },
    },
  ],
}
