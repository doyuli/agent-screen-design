import type { MaterialDefinitionSchema } from '~~/shared/schema/material'
import { ListIcon } from '@lucide/vue'

export const scrollListMaterialSchema: MaterialDefinitionSchema = {
  name: 'scroll-list',
  group: 'tables',
  icon: ListIcon,
  schema: {
    type: 'scroll-list',
    name: '滚动列表',
    description: '表格',
    locked: false,
    layout: {
      x: 0,
      y: 0,
      width: 420,
      height: 280,
      lockRatio: false,
    },
    style: {
      fontSize: 14,
      color: '#cbd5e1',
      headerColor: '#ffffff',
      headerBackground: 'rgba(34, 211, 238, 0.15)',
      stripeBackground: 'rgba(148, 163, 184, 0.08)',
    },
    props: {
      columns: [
        { key: 'name', label: '设备名称' },
        { key: 'value', label: '实时数值', align: 'right' },
        { key: 'status', label: '状态', align: 'center', width: 80 },
      ],
      rows: [
        { name: '1号生产线', value: 1280, status: '正常' },
        { name: '2号生产线', value: 986, status: '正常' },
        { name: '3号生产线', value: 1532, status: '告警' },
        { name: '4号生产线', value: 764, status: '正常' },
        { name: '5号生产线', value: 1108, status: '正常' },
        { name: '6号生产线', value: 892, status: '离线' },
        { name: '7号生产线', value: 1345, status: '正常' },
        { name: '8号生产线', value: 1057, status: '正常' },
      ],
      rowHeight: 40,
      duration: 15,
      hoverPause: true,
      stripe: true,
    },
  },
  fields: [
    {
      key: 'props.columns',
      label: '列配置',
      type: 'json',
    },
    {
      key: '',
      label: '',
      type: 'separator',
    },
    {
      key: 'style.fontSize',
      label: '字号',
      type: 'number',
      span: 12,
    },
    {
      key: 'props.rowHeight',
      label: '行高',
      type: 'number',
      span: 12,
    },
    {
      key: 'style.color',
      label: '行文字色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.headerColor',
      label: '表头文字色',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.headerBackground',
      label: '表头背景',
      type: 'color',
      span: 12,
    },
    {
      key: 'style.stripeBackground',
      label: '斑马纹色',
      type: 'color',
      span: 12,
    },
    {
      key: '',
      label: '',
      type: 'separator',
    },
    {
      key: 'props.duration',
      label: '滚动周期(s)',
      type: 'number',
      span: 24,
    },
    {
      key: 'props.hoverPause',
      label: '悬停暂停',
      type: 'switch',
      span: 12,
    },
    {
      key: 'props.stripe',
      label: '斑马纹',
      type: 'switch',
      span: 12,
    },
  ],
}
