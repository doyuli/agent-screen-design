<script setup lang="ts">
import type { RatioDimension } from '~/utils/dimension'
import { ColorPicker } from '@/components/ui/color'
import { ScrollArea } from '@/components/ui/scroll-area'
import { updateDimension } from '~/utils/dimension'

const editorStore = useEditorStore()
const { pageSchema, canvas } = storeToRefs(editorStore)

const drafts = reactive({
  width: canvas.value.width,
  height: canvas.value.height,
})
const lockRatio = ref(false)

function resetDrafts() {
  drafts.width = canvas.value.width
  drafts.height = canvas.value.height
}

function commitDimension(dimension: RatioDimension) {
  const value = drafts[dimension]
  if (value > 0)
    updateDimension(canvas.value, dimension, value, lockRatio.value)

  resetDrafts()
}

function commitOnEnter(event: KeyboardEvent) {
  (event.target as HTMLInputElement).blur()
}
</script>

<template>
  <ScrollArea class="min-h-0 flex-1">
    <div class="m-0 space-y-5 p-4">
      <div class="space-y-2">
        <Label for="name">页面名称</Label>
        <Input id="name" v-model="pageSchema.name" />
      </div>
      <div class="space-y-2">
        <Label for="background-color">背景颜色</Label>
        <ColorPicker id="background-color" v-model="canvas.backgroundColor" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-2">
          <Label for="width">宽</Label>
          <Input
            id="width"
            v-model="drafts.width"
            type="number"
            @keydown.enter.prevent="commitOnEnter"
            @blur="commitDimension('width')"
          />
        </div>
        <div class="space-y-2">
          <Label for="height">高</Label>
          <Input
            id="height"
            v-model="drafts.height"
            type="number"
            @keydown.enter.prevent="commitOnEnter"
            @blur="commitDimension('height')"
          />
        </div>
      </div>
      <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
        <Label for="lock-ratio" class="text-sm">锁定比例</Label>
        <Switch id="lock-ratio" v-model="lockRatio" />
      </div>
    </div>
  </ScrollArea>
</template>
