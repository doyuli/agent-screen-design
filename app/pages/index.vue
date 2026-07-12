<script setup lang="ts">
import { computed, ref } from 'vue'
import CanvasRoot from '@/components/designer/CanvasRoot.vue'
import LayerPanel from '@/components/designer/LayerPanel.vue'
import MaterialPanel from '@/components/designer/MaterialPanel.vue'
import PropertyPanel from '@/components/designer/PropertyPanel.vue'
import Toolbar from '@/components/designer/Toolbar.vue'

const materialCollapsed = ref(false)
const layerCollapsed = ref(true)
const propertyCollapsed = ref(false)

const pageConfig = {
  id: 'city-operations-home',
  name: '城市运营大屏 / 首页',
  viewport: {
    width: 1920,
    height: 1080,
  },
  components: [
    { id: 'metric-summary', type: 'MetricCards', name: '运营指标' },
    { id: 'transaction-trend', type: 'LineChart', name: '实时交易趋势' },
    { id: 'regional-map', type: 'Map', name: '区域分布' },
    { id: 'event-stream', type: 'EventList', name: '事件流' },
  ],
}
const pageJson = JSON.stringify(pageConfig, null, 2)

const layoutColumns = computed(() => [
  materialCollapsed.value ? '0px' : '240px',
  layerCollapsed.value ? '0px' : '208px',
  'minmax(0, 1fr)',
  propertyCollapsed.value ? '0px' : '320px',
].join(' '))
</script>

<template>
  <main class="flex h-svh min-h-0 flex-col overflow-hidden bg-background text-foreground">
    <Toolbar
      :material-collapsed="materialCollapsed"
      :layer-collapsed="layerCollapsed"
      :property-collapsed="propertyCollapsed"
      :page-json="pageJson"
      @toggle-material="materialCollapsed = !materialCollapsed"
      @toggle-layer="layerCollapsed = !layerCollapsed"
      @toggle-property="propertyCollapsed = !propertyCollapsed"
    />

    <div
      class="grid min-h-0 flex-1 transition-[grid-template-columns] duration-200 ease-out"
      :style="{ gridTemplateColumns: layoutColumns }"
    >
      <div class="min-w-0 overflow-hidden">
        <MaterialPanel v-show="!materialCollapsed" />
      </div>
      <div class="min-w-0 overflow-hidden">
        <LayerPanel v-show="!layerCollapsed" />
      </div>
      <CanvasRoot />
      <div class="min-w-0 overflow-hidden">
        <PropertyPanel v-show="!propertyCollapsed" />
      </div>
    </div>
  </main>
</template>
