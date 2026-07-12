<script setup lang="ts">
import {
  Activity,
  Bell,
  CircleDollarSign,
  Database,
  MapPin,
  Users,
} from '@lucide/vue'
import { computed, useTemplateRef } from 'vue'
import SketchRuler from 'vue3-sketch-ruler'
import { useCanvasRuler } from '@/components/designer/useCanvasRuler'
import 'vue3-sketch-ruler/lib/style.css'

const metrics = [
  { icon: CircleDollarSign, label: '今日成交额', value: '86.42M', tone: 'bg-emerald-500' },
  { icon: Users, label: '在线用户', value: '128,406', tone: 'bg-sky-500' },
  { icon: Bell, label: '实时告警', value: '23', tone: 'bg-amber-500' },
]

const bars = [56, 72, 48, 86, 66, 92, 74, 58, 80, 68, 88, 76]
const rows = ['华东节点 CPU 异常', '城市热力图刷新完成', '订单峰值超过阈值', '客流监测恢复稳定']

const previewWidth = 1120
const previewHeight = 630
const canvasRoot = useTemplateRef<HTMLElement>('canvasRoot')
const {
  canvasWidth,
  canvasHeight,
  canvasStyle,
  rectWidth,
  rectHeight,
  lines,
  scale,
  palette,
  onZoomChange,
} = useCanvasRuler({ canvasRootRef: canvasRoot })
const previewStyle = computed(() => ({
  transform: `scale(${Math.min(canvasWidth.value / previewWidth, canvasHeight.value / previewHeight)})`,
}))
</script>

<template>
  <section class="relative min-w-0 overflow-hidden bg-muted/40">
    <div ref="canvasRoot" class="canvas-root">
      <SketchRuler
        v-if="rectWidth > 0 && rectHeight > 0"
        v-model:scale="scale"
        :width="rectWidth"
        :height="rectHeight"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :thick="20"
        :lines="lines"
        :palette="palette"
        @zoomchange="onZoomChange"
      >
        <template #default>
          <div data-type="page" class="canvas-stage" :style="canvasStyle">
            <div class="origin-top-left" :style="previewStyle">
              <div class="h-[630px] w-[1120px] overflow-hidden bg-[#07111f] p-4 text-white">
                <div class="mb-4 flex items-center justify-between">
                  <div>
                    <h1 class="text-2xl font-semibold tracking-normal">
                      城市运营态势总览
                    </h1>
                    <p class="mt-1 text-sm text-slate-300">
                      实时数据 · 低代码大屏设计器预览
                    </p>
                  </div>
                  <div class="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-right">
                    <div class="text-xs text-cyan-100">
                      2026-07-12
                    </div>
                    <div class="text-lg font-semibold">
                      18:24:06
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div
                    v-for="item in metrics"
                    :key="item.label"
                    class="rounded-lg border border-white/10 bg-white/6 p-3"
                  >
                    <div class="mb-3 flex items-center justify-between">
                      <span class="text-sm text-slate-300">{{ item.label }}</span>
                      <span class="flex size-8 items-center justify-center rounded-md text-white" :class="item.tone">
                        <component :is="item.icon" class="size-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div class="text-3xl font-semibold tracking-normal">
                      {{ item.value }}
                    </div>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-[1.35fr_0.65fr] gap-4">
                  <div class="rounded-lg border border-white/10 bg-white/6 p-3">
                    <div class="mb-3 flex items-center justify-between">
                      <div>
                        <h2 class="text-base font-semibold">
                          实时交易趋势
                        </h2>
                        <p class="text-xs text-slate-400">
                          最近 12 小时
                        </p>
                      </div>
                      <Activity class="size-5 text-cyan-300" aria-hidden="true" />
                    </div>
                    <div class="flex h-40 items-end gap-2">
                      <div
                        v-for="(bar, index) in bars"
                        :key="index"
                        class="flex flex-1 items-end rounded-t-sm bg-cyan-300/15"
                        :style="{ height: `${bar}%` }"
                      >
                        <div class="h-2 w-full rounded-t-sm bg-cyan-300" />
                      </div>
                    </div>
                  </div>

                  <div class="rounded-lg border border-white/10 bg-white/6 p-3">
                    <div class="mb-3 flex items-center justify-between">
                      <h2 class="text-base font-semibold">
                        区域分布
                      </h2>
                      <MapPin class="size-5 text-emerald-300" aria-hidden="true" />
                    </div>
                    <div class="relative h-40 rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.22),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.18),rgba(59,130,246,0.12))]">
                      <span class="absolute left-[24%] top-[34%] size-3 rounded-full bg-cyan-300 shadow-[0_0_0_8px_rgba(103,232,249,0.12)]" />
                      <span class="absolute left-[58%] top-[46%] size-3 rounded-full bg-emerald-300 shadow-[0_0_0_8px_rgba(110,231,183,0.12)]" />
                      <span class="absolute left-[44%] top-[68%] size-3 rounded-full bg-amber-300 shadow-[0_0_0_8px_rgba(252,211,77,0.12)]" />
                    </div>
                  </div>
                </div>

                <div class="mt-4 rounded-lg border border-white/10 bg-white/6 p-3">
                  <div class="mb-3 flex items-center justify-between">
                    <h2 class="text-base font-semibold">
                      事件流
                    </h2>
                    <Database class="size-5 text-slate-300" aria-hidden="true" />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="row in rows"
                      :key="row"
                      class="flex items-center justify-between rounded-md bg-white/6 px-3 py-2 text-sm"
                    >
                      <span>{{ row }}</span>
                      <span class="text-xs text-slate-400">刚刚</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </SketchRuler>
    </div>
  </section>
</template>

<style scoped>
.canvas-root {
  position: relative;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
}

.canvas-stage {
  position: relative;
}
</style>
