<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import { Check, Copy } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const props = defineProps<{
  node: MaterialSchema | undefined
}>()

const open = defineModel<boolean>('open', { default: false })
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const formattedNodeConfig = computed(() => JSON.stringify(props.node, null, 2) || '{}')

watch(open, (isOpen) => {
  if (isOpen)
    copyState.value = 'idle'
})

function copyNodeConfig() {
  const textArea = document.createElement('textarea')

  textArea.value = formattedNodeConfig.value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.append(textArea)
  textArea.select()
  copyState.value = document.execCommand('copy') ? 'copied' : 'failed'
  textArea.remove()
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(32rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>节点 JSON</SheetTitle>
        <SheetDescription>当前节点的只读配置</SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-auto bg-muted/30 p-4">
        <pre class="min-h-full whitespace-pre-wrap wrap-break-word rounded-md border bg-background p-3 font-mono text-xs leading-5 text-foreground"><code>{{ formattedNodeConfig }}</code></pre>
      </div>

      <SheetFooter class="flex-row justify-between border-t sm:justify-between">
        <span v-if="copyState === 'copied'" class="text-xs text-muted-foreground">已复制到剪贴板</span>
        <span v-else-if="copyState === 'failed'" class="text-xs text-destructive">复制失败，请重试</span>
        <span v-else class="text-xs text-muted-foreground">只读配置</span>
        <Button size="sm" @click="copyNodeConfig">
          <Check v-if="copyState === 'copied'" class="size-4" aria-hidden="true" />
          <Copy v-else class="size-4" aria-hidden="true" />
          复制
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
