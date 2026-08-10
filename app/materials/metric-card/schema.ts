import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { TrendingUpIcon } from '@lucide/vue'

export const metricCardMaterialSchema: MaterialDefinitionSchema = {
  name: 'metric-card',
  group: 'basics',
  icon: TrendingUpIcon,
  schema: {
    type: 'metric-card',
    name: '指标卡',
    description: '基础',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 240,
      height: 130,
      lockRatio: false,
    },
    style: {
      background: '#00000000',
      color: '#22d3ee',
      fontSize: 36,
      titleColor: '#94a3b8',
    },
    props: {
      title: '设备总数',
      value: 12345,
      unit: '台',
      decimals: 0,
      separator: true,
      showTrend: true,
      trend: 12.5,
      duration: 1000,
    },
  },
  fields: [
    {
      key: 'props.title',
      label: '标题',
      type: 'input',
    },
    {
      key: 'props.value',
      label: '数值',
      type: 'number',
      span: 12,
    },
    {
      key: 'props.unit',
      label: '单位',
      type: 'input',
      span: 12,
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
      key: 'props.showTrend',
      label: '显示趋势',
      type: 'switch',
      span: 24,
    },
    {
      key: 'props.trend',
      label: '趋势值(%)',
      type: 'number',
      span: 24,
    },
    {
      key: '',
      label: '',
      type: 'separator',
    },
    {
      key: 'style.color',
      label: '数值色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.fontSize',
      label: '数值字号',
      type: 'number',
      span: 12,
    },
    {
      key: 'style.titleColor',
      label: '标题色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.background',
      label: '背景色',
      type: 'color',
      span: 12,
    },
  ],
}
