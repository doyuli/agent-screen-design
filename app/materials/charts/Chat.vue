<script setup lang="ts">
import type { EChartsOption, EChartsType } from 'echarts'
import type { MaterialSchema } from '~~/shared/schema/material'
import { init } from 'echarts'

defineOptions({
  name: 'ChartMaterial',
})

const props = defineProps<{
  schema: MaterialSchema
}>()

const chartRef = useTemplateRef('chartRef')

let chart: EChartsType

const option = computed(() => props.schema.props.option || {})

watch(
  option,
  (newValue) => {
    chart.setOption(newValue as EChartsOption)
  },
  { deep: true },
)

onMounted(() => {
  chart = init(chartRef.value)

  chart.setOption(option.value as EChartsOption)

  const observer = new ResizeObserver(() => {
    chart.resize()
  })

  observer.observe(chartRef.value as Element)

  onBeforeUnmount(() => {
    observer.disconnect()
    chart.dispose()
  })
})
</script>

<template>
  <div ref="chartRef" class="w-full h-full" />
</template>
