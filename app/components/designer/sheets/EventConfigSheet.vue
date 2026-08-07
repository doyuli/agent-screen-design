<script setup lang="ts">
import type { MaterialEventSchema, MaterialSchema } from '~~/shared/schema/material'
import { Plus, Save, Trash2 } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { materialEventSchema } from '~~/shared/schema/material'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getMaterialEvents } from '~/materials'
import { registerMonacoRuntimeTypes } from '~/runtime/monaco'
import { deepClone } from '~/utils'
import EventCodeTools from './EventCodeTools.vue'

const props = defineProps<{
  node: MaterialSchema
}>()

const emit = defineEmits<{
  save: [events: MaterialEventSchema[]]
}>()

const open = defineModel<boolean>('open', { default: false })

const eventCodeEditor = useTemplateRef<InstanceType<typeof MonacoEditor>>('event-code-editor')
const selectedEventIndex = ref(0)
const draftEvents = ref<MaterialEventSchema[]>([])
const selectedEvent = computed(() => draftEvents.value[selectedEventIndex.value])

const eventTypes = computed(() => getMaterialEvents(props.node.type))
const hasAvailableEventType = computed(() => eventTypes.value.some(eventType => !draftEvents.value.some(event => event.type === eventType.value)))

registerMonacoRuntimeTypes()

function addEvent() {
  const eventType = eventTypes.value.find(eventType => !draftEvents.value.some(event => event.type === eventType.value))
  if (!eventType) {
    toast.error('所有事件类型均已配置')
    return
  }

  const event: MaterialEventSchema = {
    title: `${eventType.label}事件`,
    type: eventType.value,
    name: `on${eventType.value[0]!.toUpperCase()}${eventType.value.slice(1)}`,
    code: '',
  }

  draftEvents.value.push(event)
  selectedEventIndex.value = draftEvents.value.length - 1
}

function removeSelectedEvent() {
  if (!selectedEvent.value)
    return

  draftEvents.value.splice(selectedEventIndex.value, 1)
  selectedEventIndex.value = Math.min(selectedEventIndex.value, draftEvents.value.length - 1)
}

function isEventTypeInUse(type: string) {
  return draftEvents.value.some((event, index) => index !== selectedEventIndex.value && event.type === type)
}

function insertCodeAtCursor(code: string) {
  if (!selectedEvent.value)
    return

  const instance = eventCodeEditor.value?.getInstance()
  const position = instance?.getPosition()
  if (!instance || !position)
    return

  instance.executeEdits('event-config-sheet', [{
    range: {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    },
    text: code,
    forceMoveMarkers: true,
  }])
  selectedEvent.value.code = instance.getValue()
  instance.focus()
}

function saveEvents() {
  if (draftEvents.value.some(event => !event.name.trim())) {
    toast.error('事件函数名称不能为空')
    return
  }

  if (new Set(draftEvents.value.map(event => event.name)).size !== draftEvents.value.length) {
    toast.error('事件函数名称不能重复')
    return
  }

  if (new Set(draftEvents.value.map(event => event.type)).size !== draftEvents.value.length) {
    toast.error('事件类型不能重复')
    return
  }

  const result = materialEventSchema.array().safeParse(draftEvents.value)
  if (!result.success) {
    toast.error(result.error.issues[0]?.message ?? '事件配置不符合 Schema 要求')
    return
  }

  emit('save', result.data)
  toast.success('事件配置已保存')
  open.value = false
}

watch(open, (isOpen) => {
  if (!isOpen)
    return

  draftEvents.value = props.node.events?.map(deepClone) ?? []
  selectedEventIndex.value = 0
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(48rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>事件配置</SheetTitle>
        <SheetDescription>配置组件的交互行为</SheetDescription>
      </SheetHeader>

      <div class="grid min-h-0 flex-1 md:grid-cols-[12rem_minmax(0,1fr)]">
        <section class="flex min-h-0 flex-col border-b md:border-r md:border-b-0">
          <div class="border-b p-3">
            <Button class="w-full" size="sm" :disabled="!node || !hasAvailableEventType" @click="addEvent">
              <Plus class="size-4" aria-hidden="true" />
              新增事件
            </Button>
          </div>
          <div class="min-h-0 flex-1 space-y-1 overflow-auto p-2">
            <button
              v-for="(event, index) in draftEvents"
              :key="index"
              class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :class="index === selectedEventIndex && 'bg-accent text-accent-foreground'"
              @click="selectedEventIndex = index"
            >
              <span class="block truncate font-medium">{{ event.title }}</span>
              <span class="mt-0.5 block text-xs text-muted-foreground">{{ event.type }}</span>
            </button>
          </div>
        </section>

        <section v-if="selectedEvent" class="min-h-0 overflow-auto p-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold">
                事件详情
              </h3>
              <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="removeSelectedEvent">
                <Trash2 class="size-4" aria-hidden="true" />
                删除
              </Button>
            </div>

            <div class="space-y-2">
              <Label for="event-name">事件名称</Label>
              <Input id="event-name" v-model="selectedEvent.title" />
            </div>

            <div class="space-y-2">
              <Label for="event-function-name">函数名称</Label>
              <Input id="event-function-name" v-model="selectedEvent.name" />
            </div>

            <div class="space-y-2">
              <Label for="event-type">事件类型</Label>
              <Select v-model="selectedEvent.type">
                <SelectTrigger id="event-type" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="eventType in eventTypes" :key="eventType.value" :value="eventType.value" :disabled="isEventTypeInUse(eventType.value)">
                    {{ eventType.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>事件函数体</Label>
              <EventCodeTools :node="node" :open="open" @insert="insertCodeAtCursor" />
              <div class="rounded-md border bg-background">
                <div class="border-b bg-muted/50 px-3 py-2 font-mono text-sm text-muted-foreground">
                  function {{ selectedEvent.name }}($context, $node, $payload) {
                </div>
                <div class="h-72 py-2">
                  <MonacoEditor
                    ref="event-code-editor"
                    v-model="selectedEvent.code"
                    language="javascript"
                    :monaco-options="{ stickyScroll: { enabled: false } }"
                  />
                </div>
                <div class="border-t bg-muted/50 px-3 py-2 font-mono text-sm text-muted-foreground">
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <div v-else class="flex min-h-0 items-center justify-center p-4 text-sm text-muted-foreground">
          暂无事件
        </div>
      </div>

      <SheetFooter class="flex-row justify-end border-t sm:justify-end">
        <Button size="sm" @click="saveEvents">
          <Save class="size-4" aria-hidden="true" />
          保存
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
