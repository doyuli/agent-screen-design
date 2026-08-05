<script setup lang="ts">
import { Check, Copy, Download, FileInput, Save } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { pageSchema } from '~~/shared/schema/page'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { safeJsonParse, serializeJson } from '~/utils/parser'

const open = defineModel<boolean>('open', { default: false })

const editorStore = useEditorStore()
const { pageSchema: currentPage } = storeToRefs(editorStore)

const formattedPageConfig = ref('{}')

const { copy, copied } = useClipboard({
  source: formattedPageConfig,
  legacy: true,
})

const fileInput = useTemplateRef<HTMLInputElement>('file-input')

watch(open, (isOpen) => {
  if (!isOpen)
    return

  formattedPageConfig.value = serializeJson(currentPage.value, '{}')
})

function importPageConfig() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file)
    return

  try {
    const json = await file.text()
    const parsedConfig = safeJsonParse(json)

    if (!parsedConfig.success) {
      toast.error('JSON 格式有误，请检查后重试')
      return
    }

    const result = pageSchema.safeParse(parsedConfig.data)

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? '配置不符合 Schema 要求')
      return
    }

    formattedPageConfig.value = serializeJson(result.data, '{}')
    toast.success('配置已载入，请点击保存应用')
  }
  catch {
    toast.error('文件读取失败，请重试')
  }
  finally {
    input.value = ''
  }
}

function savePageConfig() {
  const parsedConfig = safeJsonParse(formattedPageConfig.value)

  if (!parsedConfig.success) {
    toast.error('JSON 格式有误，请检查后重试')
    return
  }

  const result = pageSchema.safeParse(parsedConfig.data)

  if (!result.success) {
    toast.error(result.error.issues[0]?.message ?? '页面配置不符合 Schema 要求')
    return
  }

  editorStore.setPageSchema(result.data)
  open.value = false
}

function downloadPageConfig() {
  const blob = new Blob([formattedPageConfig.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'screen-design.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(32rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>页面 JSON</SheetTitle>
        <SheetDescription>编辑当前页面的 JSON 配置</SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-auto bg-muted/30 py-2">
        <MonacoEditor v-model="formattedPageConfig" />
      </div>

      <SheetFooter class="flex-row flex-wrap justify-between border-t sm:justify-between">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="下载页面 JSON" @click="downloadPageConfig">
            <Download class="size-4" aria-hidden="true" />
          </Button>
          <span class="text-xs text-muted-foreground">{{ copied ? '已复制到剪贴板' : '编辑后点击保存以应用更改' }}</span>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" size="sm" @click="importPageConfig">
            <FileInput class="size-4" aria-hidden="true" />
            导入
          </Button>
          <Button variant="outline" size="sm" @click="copy()">
            <component :is="copied ? Check : Copy" class="size-4" aria-hidden="true" />
            复制
          </Button>
          <Button size="sm" @click="savePageConfig">
            <Save class="size-4" aria-hidden="true" />
            保存
          </Button>
        </div>
      </SheetFooter>

      <input ref="file-input" class="hidden" type="file" accept="application/json" @change="handleFileChange">
    </SheetContent>
  </Sheet>
</template>
