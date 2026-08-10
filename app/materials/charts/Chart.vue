<script setup lang="ts">
import type { EChartsOption, EChartsType } from 'echarts'
import type { MaterialSchema } from '~~/shared/schema/material'
import { init } from 'echarts'
import { useDataSource } from '@/composables/data-source'
import { ensureArray, ensureRecord } from '../_shared/data'

defineOptions({
  name: 'ChartMaterial',
})

const props = defineProps<{
  schema: MaterialSchema
}>()

const emit = defineEmits<{
  click: [payload: unknown]
  legendselectchanged: [payload: unknown]
}>()

const dataSourceId = computed(() => props.schema.dataSourceId)

const { data: dataSourceData, refresh } = useDataSource(dataSourceId)

const chartRef = useTemplateRef('chart-root')

let chart: EChartsType

const option = computed(() => {
  const opt = (props.schema.props.option ?? {}) as EChartsOption
  const dataset = ensureRecord(opt.dataset)
  return {
    ...opt,
    dataset: {
      ...dataset,
      source: ensureArray(dataSourceData.value, dataset.source as unknown[] || []),
    },
  }
})

watch(
  option,
  (value) => {
    chart.setOption(value as EChartsOption)
  },
  { deep: true },
)

onMounted(() => {
  chart = init(chartRef.value)

  chart.setOption(option.value as EChartsOption)
  chart.on('click', params => emit('click', params))
  chart.on('legendselectchanged', params => emit('legendselectchanged', params))

  const observer = new ResizeObserver(() => {
    chart.resize()
  })

  observer.observe(chartRef.value as Element)

  onBeforeUnmount(() => {
    observer.disconnect()
    chart.dispose()
  })
})

defineExpose({
  refresh,
})
</script>

<template>
  <div ref="chart-root" class="w-full h-full" />
</template>
