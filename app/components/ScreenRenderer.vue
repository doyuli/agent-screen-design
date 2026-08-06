<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { useEventListener } from '@vueuse/core'
import { provideDataSource } from '~/composables/data-source'
import { getMaterialComponent } from '~/materials'
import { createRuntimeContext } from '~/runtime/context'
import { runSandbox } from '~/runtime/sandbox'

const props = defineProps<{
  schema: PageSchema
}>()

const runtimeSchema = toRef(props, 'schema')
const runtimeContext = createRuntimeContext(runtimeSchema)

const nodes = computed(() => runtimeSchema.value.nodes)
const canvas = computed(() => runtimeSchema.value.canvas)
const dataSources = computed(() => runtimeSchema.value.dataSources)

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

const instance = getCurrentInstance()

function initializeRuntimeContext() {
  if (!instance?.refs)
    return

  for (const key in instance.refs) {
    const vm = instance.refs[key]
    runtimeContext.registerInstance(key, Array.isArray(vm) ? vm[0] : vm)
  }
}

function initializeEventListeners(node: MaterialSchema) {
  const listeners: Record<string, (payload: unknown) => void> = {}

  for (const event of node?.events ?? []) {
    if (event.handler) {
      listeners[event.type] = event.handler
      continue
    }

    const listener = (payload: unknown) => {
      runSandbox(event.code, {
        $node: node,
        $context: runtimeContext,
        $payload: payload,
      })
    }

    listeners[event.type] = listener
    event.handler = listener
  }

  return listeners
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
  initializeRuntimeContext()
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
        <component
          :is="getMaterialComponent(node.type)"
          :ref="node.id"
          :schema="node"
          v-on="initializeEventListeners(node)"
        />
      </div>
    </div>
  </div>
</template>
