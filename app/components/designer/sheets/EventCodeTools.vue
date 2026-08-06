<script setup lang="ts">
import type { MaterialSchema } from '~~/shared/schema/material'
import { Check, Copy, Send } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  node?: MaterialSchema
  open: boolean
}>()

const emit = defineEmits<{
  insert: [code: string]
}>()

const editorStore = useEditorStore()
const { nodes } = storeToRefs(editorStore)
const { copy, copied } = useClipboard({ legacy: true })

const selectedTargetNodeId = ref<string>()
const selectedTargetEventName = ref<string>()
const otherNodes = computed(() => nodes.value.filter(node => node.id !== props.node?.id))
const selectedTargetNode = computed(() => otherNodes.value.find(node => node.id === selectedTargetNodeId.value))
const targetEvents = computed(() => selectedTargetNode.value?.events ?? [])

function copyTargetNodeId() {
  if (selectedTargetNode.value)
    copy(selectedTargetNode.value.id)
}

function insertDispatchCode() {
  const event = targetEvents.value.find(event => event.name === selectedTargetEventName.value)
  if (selectedTargetNode.value && event)
    emit('insert', `\n$context.dispatch('${selectedTargetNode.value.id}', '${event.name}')`)
}

function resetSelection() {
  selectedTargetNodeId.value = undefined
  selectedTargetEventName.value = undefined
}

watch(() => props.open, (isOpen) => {
  if (isOpen)
    resetSelection()
})

watch(selectedTargetNodeId, () => {
  selectedTargetEventName.value = undefined
})
</script>

<template>
  <Accordion type="single" collapsible class="rounded-md border bg-muted/20 px-3">
    <AccordionItem value="event-code-tools">
      <AccordionTrigger class="py-3 hover:no-underline">
        辅助工具
      </AccordionTrigger>
      <AccordionContent class="pb-3">
        <div class="space-y-3">
          <div class="space-y-2">
            <Label for="target-node">目标组件</Label>
            <Select v-model="selectedTargetNodeId" :disabled="!otherNodes.length">
              <SelectTrigger id="target-node" class="w-full">
                <SelectValue placeholder="选择其他组件" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="targetNode in otherNodes" :key="targetNode.id" :value="targetNode.id">
                  {{ targetNode.name }} ({{ targetNode.id }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="target-event">目标事件</Label>
            <Select v-model="selectedTargetEventName" :disabled="!targetEvents.length">
              <SelectTrigger id="target-event" class="w-full">
                <SelectValue placeholder="选择目标事件" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="targetEvent in targetEvents" :key="targetEvent.name" :value="targetEvent.name">
                  {{ targetEvent.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" :disabled="!selectedTargetNode" @click="copyTargetNodeId">
              <component :is="copied ? Check : Copy" class="size-4" aria-hidden="true" />
              复制节点 ID
            </Button>
            <Button size="sm" variant="secondary" :disabled="!selectedTargetNode || !selectedTargetEventName" @click="insertDispatchCode">
              <Send class="size-4" aria-hidden="true" />
              插入 dispatch
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
