<script setup lang="ts">
import { Check, Copy, Download } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const props = defineProps<{
  pageJson: string
}>()

const open = defineModel<boolean>('open', { default: false })
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const formattedPageConfig = computed(() => props.pageJson || '{}')

watch(open, (isOpen) => {
  if (isOpen)
    copyState.value = 'idle'
})

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
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(32rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>页面 JSON</SheetTitle>
        <SheetDescription>当前页面的只读配置</SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-auto bg-muted/30 p-4">
        <pre class="min-h-full whitespace-pre-wrap wrap-break-word rounded-md border bg-background p-3 font-mono text-xs leading-5 text-foreground"><code>{{ formattedPageConfig }}</code></pre>
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
</template>
