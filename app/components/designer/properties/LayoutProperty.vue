<script setup lang="ts">
import { updateDimension } from '~/utils/dimension'

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const selectedNodeLayout = computed(() => selectedNode.value!.layout)

function createPositionRef(dimension: 'x' | 'y') {
  return computed({
    get: () => Math.round(selectedNode.value?.layout[dimension] ?? 0),
    set: (value) => {
      const position = Number(value)
      const layout = selectedNodeLayout.value

      if (layout && Number.isFinite(position))
        layout[dimension] = Math.round(position)
    },
  })
}

const x = createPositionRef('x')
const y = createPositionRef('y')

const width = computed({
  get: () => selectedNodeLayout.value.width,
  set: (value) => {
    const layout = selectedNodeLayout.value
    if (layout)
      updateDimension(layout, 'width', value, layout.lockRatio)
  },
})

const height = computed({
  get: () => selectedNodeLayout.value.height,
  set: (value) => {
    const layout = selectedNodeLayout.value
    if (layout)
      updateDimension(layout, 'height', value, layout.lockRatio)
  },
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="space-y-2">
      <Label for="x">X</Label>
      <Input
        id="x"
        v-model="x"
        type="number"
      />
    </div>
    <div class="space-y-2">
      <Label for="y">Y</Label>
      <Input
        id="y"
        v-model="y"
        type="number"
      />
    </div>
    <div class="space-y-2">
      <Label for="width">宽</Label>
      <Input
        id="width"
        v-model="width"
        type="number"
      />
    </div>
    <div class="space-y-2">
      <Label for="height">高</Label>
      <Input
        id="height"
        v-model="height"
        type="number"
      />
    </div>
  </div>
  <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
    <Label for="lock-ratio" class="text-sm">锁定比例</Label>
    <Switch id="lock-ratio" v-model="selectedNodeLayout.lockRatio" />
  </div>
</template>
