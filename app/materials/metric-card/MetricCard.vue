<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import { TrendingDownIcon, TrendingUpIcon } from '@lucide/vue'
import { useDataSource } from '@/composables/data-source'
import { formatCountUpValue, useCountUp } from '../shared/count-up'
import { ensureNumber, ensureRecord } from '../shared/data'

const props = defineProps<{
  schema: MaterialSchema
}>()

const dataSourceId = computed(() => props.schema.dataSourceId)
const { data: dataSourceData } = useDataSource(dataSourceId)

const recordDataSource = computed(() => ensureRecord(dataSourceData.value))
const targetValue = computed(() => ensureNumber(
  recordDataSource.value.value,
  ensureNumber(dataSourceData.value, Number(props.schema.props?.value ?? 0)),
))

const duration = computed(() => Number(props.schema.props?.duration ?? 1000))

const transitioned = useCountUp(targetValue, duration)

const valueText = computed(() => {
  const p = props.schema.props ?? {}
  const decimals = Number(p.decimals ?? 0)
  return formatCountUpValue(transitioned.value, decimals, !!p.separator)
})

const title = computed(() => String(props.schema.props?.title ?? ''))
const unit = computed(() => String(props.schema.props?.unit ?? ''))
const showTrend = computed(() => {
  const hasDataSourceTrend = recordDataSource.value.trend !== undefined
  return hasDataSourceTrend || Boolean(props.schema.props?.showTrend ?? true)
})
const trend = computed(() => ensureNumber(recordDataSource.value.trend, Number(props.schema.props?.trend ?? 0)))

const styleConfig = computed(() => props.schema.style ?? {})

const mutedColor = computed(() => String(styleConfig.value.titleColor ?? '#94a3b8'))
const trendColor = computed(() => (trend.value >= 0 ? '#34d399' : '#fb7185'))
</script>

<template>
  <div
    class="flex h-full w-full flex-col justify-center gap-1 px-4 py-3"
    :style="{ background: String(styleConfig.background ?? 'transparent') }"
  >
    <div class="truncate text-sm" :style="{ color: mutedColor }">
      {{ title }}
    </div>
    <div
      class="flex items-baseline gap-1 tabular-nums"
      :style="{ color: String(styleConfig.color ?? '#22d3ee'), fontSize: `${styleConfig.fontSize ?? 36}px`, lineHeight: 1.1 }"
    >
      <span class="font-bold">{{ valueText }}</span>
      <span v-if="unit" class="text-sm" :style="{ color: mutedColor }">{{ unit }}</span>
    </div>
    <div v-if="showTrend" class="flex items-center gap-1 text-sm" :style="{ color: trendColor }">
      <TrendingUpIcon v-if="trend >= 0" class="size-4" />
      <TrendingDownIcon v-else class="size-4" />
      <span>{{ Math.abs(trend) }}%</span>
    </div>
  </div>
</template>
