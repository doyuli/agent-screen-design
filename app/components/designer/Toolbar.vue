<script setup lang="ts">
import { Braces, Eye, Layers3, PanelLeft, PanelRight, Play, Redo2, Save, Send, Undo2, ZoomIn, ZoomOut } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useKeyboard } from '~/composables/keyboard'
import { useUndoRedo } from '~/composables/undo-redo'
import PageJsonSheet from './sheets/PageJsonSheet.vue'

defineProps<{
  materialCollapsed: boolean
  layerCollapsed: boolean
  propertyCollapsed: boolean
  pageJson: string
}>()

defineEmits<{
  toggleMaterial: []
  toggleLayer: []
  toggleProperty: []
}>()

const jsonOpen = ref(false)

const editorStore = useEditorStore()
const { pageSchema, canvasScale, canvas } = storeToRefs(editorStore)

const canvasScalePercentage = computed(() => Math.round(canvasScale.value * 100))

const { canUndo, canRedo, undo, redo } = useUndoRedo()
const { registerShortcut } = useKeyboard()

registerShortcut({
  keys: ['Mod+Z'],
  enabled: () => canUndo.value,
  execute: () => undo(),
})

registerShortcut({
  keys: ['Mod+Shift+Z', 'Mod+Y'],
  enabled: () => canRedo.value,
  execute: () => redo(),
})
</script>

<template>
  <TooltipProvider>
    <header class="flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-3 backdrop-blur">
      <div class="flex min-w-0 items-center gap-2">
        <div class="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                :data-active="!materialCollapsed"
                class="data-[active=true]:bg-accent"
                @click="$emit('toggleMaterial')"
              >
                <PanelLeft class="size-4" aria-hidden="true" />
                <span class="sr-only">切换物料区</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>物料区</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                :data-active="!layerCollapsed"
                class="data-[active=true]:bg-accent"
                @click="$emit('toggleLayer')"
              >
                <Layers3 class="size-4" aria-hidden="true" />
                <span class="sr-only">切换图层区</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>图层区</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                :data-active="!propertyCollapsed"
                class="data-[active=true]:bg-accent"
                @click="$emit('toggleProperty')"
              >
                <PanelRight class="size-4" aria-hidden="true" />
                <span class="sr-only">切换属性区</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>属性区</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" class="mx-1 h-5" />

        <div class="hidden items-center gap-1 md:flex">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm" :disabled="!canUndo" @click="undo">
                <Undo2 class="size-4" aria-hidden="true" />
                <span class="sr-only">撤销</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>撤销</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm" :disabled="!canRedo" @click="redo">
                <Redo2 class="size-4" aria-hidden="true" />
                <span class="sr-only">重做</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>重做</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm" @click="editorStore.stepCanvasScale(-0.1)">
                <ZoomOut class="size-4" aria-hidden="true" />
                <span class="sr-only">缩小</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>缩小</TooltipContent>
          </Tooltip>
          <Badge variant="outline" class="h-7 rounded-md px-2 text-xs font-medium">
            {{ canvasScalePercentage }}%
          </Badge>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm" @click="editorStore.stepCanvasScale(0.1)">
                <ZoomIn class="size-4" aria-hidden="true" />
                <span class="sr-only">放大</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>放大</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" class="mx-1 hidden h-5 md:block" />

        <div class="min-w-0">
          <div class="truncate text-sm font-medium">
            {{ pageSchema.name }}
          </div>
          <div class="hidden text-xs text-muted-foreground sm:block">
            {{ canvas.width }} x {{ canvas.height }} · 已自动保存
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-sm" @click="jsonOpen = true">
              <Braces class="size-4" aria-hidden="true" />
              <span class="sr-only">查看页面 JSON</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>查看页面 JSON</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" class="mx-0.5 hidden h-5 sm:block" />
        <Button variant="outline" size="sm" class="hidden sm:inline-flex">
          <Eye class="size-4" aria-hidden="true" />
          预览
        </Button>
        <Button variant="outline" size="sm" class="hidden sm:inline-flex">
          <Save class="size-4" aria-hidden="true" />
          保存
        </Button>
        <Button variant="outline" size="icon-sm" class="sm:hidden">
          <Play class="size-4" aria-hidden="true" />
          <span class="sr-only">预览</span>
        </Button>
        <Button size="sm">
          <Send class="size-4" aria-hidden="true" />
          发布
        </Button>
      </div>
    </header>

    <PageJsonSheet v-model:open="jsonOpen" :page-json="pageJson" />
  </TooltipProvider>
</template>
