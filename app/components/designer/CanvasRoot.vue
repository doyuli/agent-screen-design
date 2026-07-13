<script setup lang="ts">
import type { Material } from '~~/shared/schema/material'
import Moveable from 'vue3-moveable'
import SketchRuler from 'vue3-sketch-ruler'
import { useCanvasRuler } from '~/composables/canvas-ruler'
import { useMoveable } from '~/composables/moveable'
import { DATA_TRANSFER_KEY } from '~/constants'
import { createMaterialNode, getMaterialComponent } from '~/materials'
import 'vue3-sketch-ruler/lib/style.css'

const canvasRoot = useTemplateRef<HTMLElement>('canvasRoot')
const stageRef = useTemplateRef<HTMLElement>('stage')
const moveableRef = useTemplateRef<Moveable>('moveable')

const {
  canvasWidth,
  canvasHeight,
  canvasStyle,
  rectWidth,
  rectHeight,
  lines,
  scale,
  rulerGuidelines,
  palette,
  onZoomChange,
} = useCanvasRuler({ canvasRootRef: canvasRoot, moveableRef })

const nodes = ref<Material[]>([])
const selectedNodeId = ref<string | null>(null)

const { onDrag, onResize, onDragGroup, onResizeGroup } = useMoveable(moveableRef, nodes)

function onDrop(e: DragEvent) {
  const data = e.dataTransfer?.getData(DATA_TRANSFER_KEY)
  if (!data)
    return

  const node = createMaterialNode(JSON.parse(data))
  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  nodes.value.push(node)
  selectedNodeId.value = node.id
}

function getNodeStyle(node: Material, index: number) {
  return {
    width: `${node.layout.width}px`,
    height: `${node.layout.height}px`,
    left: `${node.layout.x}px`,
    top: `${node.layout.y}px`,
    zIndex: index + 1,
  }
}

function onSelect(node: Material, event: MouseEvent) {
  selectedNodeId.value = node.id
  event.stopPropagation()
}

const selectedTarget = shallowRef<HTMLElement | null>(null)
watch(
  () => selectedNodeId.value,
  (newVal) => {
    if (newVal) {
      const target = stageRef.value?.querySelector(`[data-node-id='${newVal}']:not([data-node-locked='true'])`)
      if (target) {
        selectedTarget.value = target as HTMLElement
      }
    }
  },
  { deep: true, flush: 'post' },
)
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
        <div ref="stage" data-type="page" class="canvas-stage" :style="canvasStyle" @dragover.prevent @drop="onDrop">
          <div
            v-for="(node, index) in nodes"
            :key="node.id"
            :data-node-id="node.id"
            :data-node-locked="node.locked"
            class="canvas-node"
            :style="getNodeStyle(node, index)"
            @mousedown="onSelect(node, $event)"
          >
            <component :is="getMaterialComponent(node.type)" :schema="node" />
          </div>
        </div>
      </SketchRuler>
      <Moveable
        ref="moveable"
        :target="selectedTarget"
        :draggable="true"
        :resizable="true"
        :origin="false"
        :snappable="true"
        :snap-container="canvasRoot"
        :horizontal-guidelines="rulerGuidelines.horizontal"
        :vertical-guidelines="rulerGuidelines.vertical"
        :snap-horizontal-threshold="5"
        :snap-vertical-threshold="5"
        :zoom="scale"
        @drag="onDrag"
        @resize="onResize"
        @drag-group="onDragGroup"
        @resize-group="onResizeGroup"
      />
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

.canvas-node {
  position: absolute;
}
</style>
