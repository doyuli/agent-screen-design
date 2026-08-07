<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import { Check, Copy, Save } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { materialSchema } from '~~/shared/schema/material'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { safeJsonParse, serializeJson } from '~/utils/parser'

const props = defineProps<{
  node: MaterialSchema
}>()

const emit = defineEmits<{
  save: [node: MaterialSchema]
}>()

const open = defineModel<boolean>('open', { default: false })
const formattedNodeConfig = ref('{}')

const { copy, copied } = useClipboard({
  source: formattedNodeConfig,
  legacy: true,
})

watch(open, (isOpen) => {
  if (!isOpen)
    return

  formattedNodeConfig.value = serializeJson(props.node, '{}')
})

function saveNodeConfig() {
  const parsedConfig = safeJsonParse(formattedNodeConfig.value)

  if (!parsedConfig.success) {
    toast.error('JSON 格式有误，请检查后重试')
    return
  }

  const result = materialSchema.safeParse(parsedConfig.data)

  if (!result.success) {
    toast.error(result.error.issues[0]?.message ?? '节点配置不符合 Schema 要求')
    return
  }

  emit('save', result.data)
  open.value = false
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(32rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>节点 JSON</SheetTitle>
        <SheetDescription>编辑当前节点的 JSON 配置</SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-auto bg-muted/30 py-2">
        <MonacoEditor v-model="formattedNodeConfig" />
      </div>

      <SheetFooter class="flex-row justify-between border-t sm:justify-between">
        <span class="text-xs text-muted-foreground">{{ copied ? '已复制到剪贴板' : '编辑后点击保存以应用更改' }}</span>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="copy()">
            <component :is="copied ? Check : Copy" class="size-4" aria-hidden="true" />
            复制
          </Button>
          <Button size="sm" @click="saveNodeConfig">
            <Save class="size-4" aria-hidden="true" />
            保存
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
