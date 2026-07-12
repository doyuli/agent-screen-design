<script setup lang="ts">
import {
  Braces,
  Check,
  Copy,
  Download,
  Eye,
  Layers3,
  PanelLeft,
  PanelRight,
  Play,
  Redo2,
  Save,
  Send,
  Undo2,
  ZoomIn,
  ZoomOut,
} from '@lucide/vue'
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
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
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const formattedPageConfig = computed(() => props.pageJson || '{}')

function openJson() {
  copyState.value = 'idle'
  jsonOpen.value = true
}

function copyPageConfig() {
  const textArea = document.createElement('textarea')

  textArea.value = formattedPageConfig.value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.append(textArea)
  textArea.select()
  copyState.value = document.execCommand('copy') ? 'copied' : 'failed'
  textArea.remove()
}

function downloadPageConfig() {
  const blob = new Blob([formattedPageConfig.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'city-operations-home.json'
  link.click()
  URL.revokeObjectURL(url)
}
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
              <Button variant="ghost" size="icon-sm">
                <Undo2 class="size-4" aria-hidden="true" />
                <span class="sr-only">撤销</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>撤销</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm">
                <Redo2 class="size-4" aria-hidden="true" />
                <span class="sr-only">重做</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>重做</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm">
                <ZoomOut class="size-4" aria-hidden="true" />
                <span class="sr-only">缩小</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>缩小</TooltipContent>
          </Tooltip>
          <Badge variant="outline" class="h-7 rounded-md px-2 text-xs font-medium">
            100%
          </Badge>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon-sm">
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
            城市运营大屏 / 首页
          </div>
          <div class="hidden text-xs text-muted-foreground sm:block">
            1920 x 1080 · 已自动保存
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-sm" @click="openJson">
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

    <Sheet v-model:open="jsonOpen">
      <SheetContent side="right" class="w-[min(32rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
        <SheetHeader class="border-b pr-12">
          <SheetTitle>页面 JSON</SheetTitle>
          <SheetDescription>当前页面的只读配置</SheetDescription>
        </SheetHeader>

        <div class="min-h-0 flex-1 overflow-auto bg-muted/30 p-4">
          <pre class="min-h-full whitespace-pre-wrap break-words rounded-md border bg-background p-3 font-mono text-xs leading-5 text-foreground"><code>{{ formattedPageConfig }}</code></pre>
        </div>

        <SheetFooter class="flex-row justify-between border-t sm:justify-between">
          <span v-if="copyState === 'copied'" class="text-xs text-muted-foreground">已复制到剪贴板</span>
          <span v-else-if="copyState === 'failed'" class="text-xs text-destructive">复制失败，请重试</span>
          <span v-else class="text-xs text-muted-foreground">只读配置</span>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" @click="downloadPageConfig">
              <Download class="size-4" aria-hidden="true" />
              下载
            </Button>
            <Button size="sm" @click="copyPageConfig">
              <Check v-if="copyState === 'copied'" class="size-4" aria-hidden="true" />
              <Copy v-else class="size-4" aria-hidden="true" />
              复制
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </TooltipProvider>
</template>
