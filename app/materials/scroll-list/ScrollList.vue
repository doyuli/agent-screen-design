<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDataSource } from '@/composables/data-source'
import { ensureArray } from '../_shared/data'

interface ColumnDef {
  key: string
  label: string
  width?: number
  align?: 'left' | 'center' | 'right'
}

const props = defineProps<{
  schema: MaterialSchema
}>()

const columns = computed<ColumnDef[]>(() => ensureArray(props.schema.props?.columns, []))

const fallbackRows = computed<Record<string, unknown>[]>(() => ensureArray(props.schema.props?.rows, []))

const dataSourceId = computed(() => props.schema.dataSourceId)
const { data: dataSourceData } = useDataSource(dataSourceId)

const rows = computed<Record<string, unknown>[]>(() => ensureArray(dataSourceData.value, fallbackRows.value))

const rowHeight = computed(() => Math.max(24, Number(props.schema.props?.rowHeight ?? 40)))
const duration = computed(() => Math.max(1, Number(props.schema.props?.duration ?? 15)))
const hoverPause = computed(() => Boolean(props.schema.props?.hoverPause ?? true))
const stripe = computed(() => Boolean(props.schema.props?.stripe ?? true))

const bodyHeight = computed(() => Math.max(0, props.schema.layout.height - rowHeight.value))
const shouldScroll = computed(() => rows.value.length * rowHeight.value > bodyHeight.value)
const displayRows = computed(() => (shouldScroll.value ? [...rows.value, ...rows.value] : rows.value))

const styleConfig = computed(() => props.schema.style ?? {})

function getColumnStyle(column: ColumnDef) {
  return {
    width: column.width ? `${column.width}px` : undefined,
    textAlign: column.align ?? 'left',
  }
}

function getRowStyle(index: number) {
  const sourceIndex = index % Math.max(1, rows.value.length)
  return {
    background: stripe.value && sourceIndex % 2 === 1
      ? String(styleConfig.value.stripeBackground ?? 'rgba(148, 163, 184, 0.08)')
      : 'transparent',
  }
}
</script>

<template>
  <div class="size-full overflow-hidden" :style="{ fontSize: `${styleConfig.fontSize ?? 14}px` }">
    <Table class="table-fixed">
      <TableHeader>
        <TableRow class="border-0 hover:bg-transparent">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            :style="{
              ...getColumnStyle(column),
              height: `${rowHeight}px`,
              color: styleConfig.headerColor ?? '#ffffff',
              background: styleConfig.headerBackground ?? 'rgba(34, 211, 238, 0.15)',
            }"
          >
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
    <div class="scroll-list__body" :style="{ height: `${bodyHeight}px` }">
      <div
        class="scroll-list__track"
        :class="{ 'is-scroll': shouldScroll, 'is-hover-pause': hoverPause }"
        :style="{ '--scroll-duration': `${duration}s` }"
      >
        <Table class="table-fixed">
          <TableBody>
            <TableRow
              v-for="(row, index) in displayRows"
              :key="index"
              class="border-0 hover:bg-transparent"
              :style="getRowStyle(index)"
            >
              <TableCell
                v-for="column in columns"
                :key="column.key"
                :style="{
                  ...getColumnStyle(column),
                  height: `${rowHeight}px`,
                  color: styleConfig.color ?? '#cbd5e1',
                }"
              >
                {{ row[column.key] }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-list__body {
  overflow: hidden;
}

.scroll-list__track.is-scroll {
  animation: scroll-list-scroll var(--scroll-duration, 15s) linear infinite;
}

.scroll-list__body:hover .scroll-list__track.is-scroll.is-hover-pause {
  animation-play-state: paused;
}

@keyframes scroll-list-scroll {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-50%);
  }
}
</style>
