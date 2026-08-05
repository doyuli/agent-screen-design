<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { useEventListener } from '@vueuse/core'
import { provideDataSource } from '~/composables/data-source'
import { getMaterialComponent } from '~/materials'

const props = defineProps<{
  schema: PageSchema
}>()

const nodes = computed(() => props.schema.nodes)
const canvas = computed(() => props.schema.canvas)
const dataSources = computed(() => props.schema.dataSources)

const canvasLayoutState = reactive({
  scale: 0,
  left: 0,
  top: 0,
})

function initializeScale() {
  const scaleX = window.innerWidth / canvas.value.width
  const scaleY = window.innerHeight / canvas.value.height

  canvasLayoutState.scale = Math.min(scaleX, scaleY)
  canvasLayoutState.left = (window.innerWidth - canvas.value.width * canvasLayoutState.scale) / 2
  canvasLayoutState.top = (window.innerHeight - canvas.value.height * canvasLayoutState.scale) / 2
}

const canvasStyle = computed(() => ({
  width: `${canvas.value.width}px`,
  height: `${canvas.value.height}px`,
  backgroundColor: canvas.value.backgroundColor,
  transform: `translate(${canvasLayoutState.left}px, ${canvasLayoutState.top}px) scale(${canvasLayoutState.scale})`,
  transformOrigin: 'left top',
}))

function getNodeStyle(node: MaterialSchema, index: number) {
  return {
    width: `${node.layout.width}px`,
    height: `${node.layout.height}px`,
    left: `${node.layout.x}px`,
    top: `${node.layout.y}px`,
    zIndex: index + 1,
  }
}

onMounted(() => {
  initializeScale()
  useEventListener('resize', initializeScale)
})

provideDataSource({
  dataSources,
})
</script>

<template>
  <div class="w-screen h-screen bg-gray-900">
    <div class="relative overflow-hidden isolate" :style="canvasStyle">
      <div
        v-for="(node, index) in nodes"
        :key="node.id"
        class="absolute"
        :style="getNodeStyle(node, index)"
      >
        <component :is="getMaterialComponent(node.type)" :schema="node" />
      </div>
    </div>
  </div>
</template>
