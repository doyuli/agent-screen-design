<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import Moveable from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useCanvasRuler } from '~/composables/canvas-ruler'
import { useMoveable } from '~/composables/moveable'
import { ATTR_NODE_ID, ATTR_NODE_LOCKED, DATA_TRANSFER_KEY } from '~/constants'
import { createMaterialNode, getMaterialComponent } from '~/materials'
import 'vue3-sketch-ruler/lib/style.css'

const canvasRoot = useTemplateRef<HTMLElement>('canvas-root')
const stageRef = useTemplateRef<HTMLElement>('canvas-stage')
const moveableRef = useTemplateRef<Moveable>('canvas-moveable')
const sketchRulerRef = useTemplateRef<InstanceType<typeof SketchRuler>>('sketch-ruler')

const editorStore = useEditorStore()
const { nodes, selectedNode, canvasScale } = storeToRefs(editorStore)

const {
  canvasWidth,
  canvasHeight,
  canvasStyle,
  rectWidth,
  rectHeight,
  lines,
  rulerGuidelines,
  palette,
  onZoomChange,
} = useCanvasRuler({ canvasRootRef: canvasRoot, moveableRef })

const { onDrag, onResize, onDragGroup, onResizeGroup, onStart, onEnd } = useMoveable(moveableRef)
const { onSelect, onClearSelected, onSelectEnd, selectedTarget } = useSelection({ stageRef, moveableRef })

watch(canvasScale, (scale) => {
  const panzoom = unref((sketchRulerRef.value as any)?.panzoomInstance)
  const rect = stageRef.value?.parentElement?.parentElement?.getBoundingClientRect()
  if (panzoom && rect && panzoom.getScale() !== scale) {
    panzoom.zoomToPoint(scale, {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    })
  }
})

function onDrop(e: DragEvent) {
  const data = e.dataTransfer?.getData(DATA_TRANSFER_KEY)
  if (!data)
    return

  const node = createMaterialNode(JSON.parse(data))
  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  editorStore.addNode(node)
  editorStore.selectNodeById(node.id)
}

function getNodeStyle(node: MaterialSchema, index: number) {
  return {
    width: `${node.layout.width}px`,
    height: `${node.layout.height}px`,
    left: `${node.layout.x}px`,
    top: `${node.layout.y}px`,
    zIndex: index + 1,
  }
}

const { getCommands } = useCommands()
</script>

<template>
  <section class="relative min-w-0 overflow-hidden bg-muted/40">
    <div ref="canvas-root" class="relative h-full overflow-hidden isolate">
      <SketchRuler
        v-if="rectWidth > 0 && rectHeight > 0"
        ref="sketch-ruler"
        v-model:scale="canvasScale"
        :width="rectWidth"
        :height="rectHeight"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :thick="20"
        :lines="lines"
        :palette="palette"
        @zoomchange="onZoomChange"
      >
        <div
          ref="canvas-stage"
          class="relative"
          :style="canvasStyle"
          @dragover.prevent
          @drop="onDrop"
          @mousedown.self="onClearSelected"
        >
          <ContextMenu v-for="(node, index) in nodes" :key="node.id">
            <ContextMenuTrigger>
              <div
                :[ATTR_NODE_ID]="node.id"
                :[ATTR_NODE_LOCKED]="node.locked"
                class="absolute"
                :style="getNodeStyle(node, index)"
                @mousedown="onSelect(node, $event)"
              >
                <component :is="getMaterialComponent(node.type)" :schema="node" />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent class="min-w-0">
              <ContextMenuItem v-for="command in getCommands(node, index)" :key="command.key" @select="command.execute(node)">
                {{ typeof command.label === 'function' ? command.label(node) : command.label }}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </SketchRuler>
      <Selecto
        v-if="stageRef"
        :container="stageRef"
        :drag-container="stageRef"
        :select-from-inside="false"
        toggle-continue-select="shift"
        :selectable-targets="[`[${ATTR_NODE_ID}]`]"
        @select-end="onSelectEnd"
      />
      <Moveable
        ref="canvas-moveable"
        :target="selectedTarget"
        :draggable="true"
        :resizable="true"
        :origin="false"
        :keep-ratio="selectedNode?.layout.lockRatio"
        :snappable="true"
        :snap-container="canvasRoot"
        :horizontal-guidelines="rulerGuidelines.horizontal"
        :vertical-guidelines="rulerGuidelines.vertical"
        :snap-horizontal-threshold="5"
        :snap-vertical-threshold="5"
        :zoom="canvasScale"
        @drag="onDrag"
        @resize="onResize"
        @drag-group="onDragGroup"
        @resize-group="onResizeGroup"
        @drag-start="onStart"
        @resize-start="onStart"
        @drag-group-start="onStart"
        @resize-group-start="onStart"
        @drag-end="onEnd"
        @drag-group-end="onEnd"
        @resize-end="onEnd"
        @resize-group-end="onEnd"
      />
    </div>
  </section>
</template>
