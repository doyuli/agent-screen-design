<script setup lang="ts">
import CanvasRoot from '@/components/designer/CanvasRoot.vue'
import LayerPanel from '@/components/designer/LayerPanel.vue'
import MaterialPanel from '@/components/designer/MaterialPanel.vue'
import PropertyPanel from '@/components/designer/PropertyPanel.vue'
import Toolbar from '@/components/designer/Toolbar.vue'

const editorStore = useEditorStore()
const { pageSchema, panelCollapsed } = storeToRefs(editorStore)

const pageJson = computed(() => JSON.stringify(pageSchema.value, null, 2))

const layoutColumns = computed(() => {
  const { material, layer, property } = panelCollapsed.value
  return [
    material ? '0px' : '240px',
    layer ? '0px' : '198px',
    'minmax(0, 1fr)',
    property ? '0px' : '320px',
  ].join(' ')
})
</script>

<template>
  <main class="flex h-svh min-h-0 flex-col overflow-hidden bg-background text-foreground">
    <Toolbar
      :material-collapsed="panelCollapsed.material"
      :layer-collapsed="panelCollapsed.layer"
      :property-collapsed="panelCollapsed.property"
      :page-json="pageJson"
      @toggle-material="panelCollapsed.material = !panelCollapsed.material"
      @toggle-layer="panelCollapsed.layer = !panelCollapsed.layer"
      @toggle-property="panelCollapsed.property = !panelCollapsed.property"
    />

    <div
      class="grid min-h-0 flex-1 transition-[grid-template-columns] duration-200 ease-out"
      :style="{ gridTemplateColumns: layoutColumns }"
    >
      <div class="min-w-0 overflow-hidden">
        <MaterialPanel v-show="!panelCollapsed.material" />
      </div>
      <div class="min-w-0 overflow-hidden">
        <LayerPanel v-show="!panelCollapsed.layer" />
      </div>
      <CanvasRoot />
      <div class="min-w-0 overflow-hidden">
        <PropertyPanel v-show="!panelCollapsed.property" />
      </div>
    </div>
  </main>
</template>
