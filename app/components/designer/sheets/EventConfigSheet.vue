<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

type EventType = 'click' | 'dblclick' | 'mouseenter'

interface EventConfig {
  id: string
  type: EventType
  name: string
  handler: string
}

const eventTypes: { label: string, value: EventType }[] = [
  { label: '点击', value: 'click' },
  { label: '双击', value: 'dblclick' },
  { label: '鼠标移入', value: 'mouseenter' },
]

const open = defineModel<boolean>('open', { default: false })
const events = ref<EventConfig[]>([])
const selectedEventId = ref<string | null>(null)
const nextEventIndex = ref(1)
const selectedEvent = computed(() => events.value.find(event => event.id === selectedEventId.value))

function resetEvents() {
  events.value = [
    {
      id: 'event-1',
      type: 'click',
      name: '点击事件',
      handler: 'console.log("event triggered")',
    },
  ]
  selectedEventId.value = 'event-1'
  nextEventIndex.value = 2
}

function addEvent() {
  const event = {
    id: `event-${nextEventIndex.value++}`,
    type: 'click' as EventType,
    name: '新事件',
    handler: 'console.log("event triggered")',
  }

  events.value.push(event)
  selectedEventId.value = event.id
}

function removeSelectedEvent() {
  const index = events.value.findIndex(event => event.id === selectedEventId.value)

  if (index === -1)
    return

  events.value.splice(index, 1)
  selectedEventId.value = events.value[index]?.id ?? events.value[index - 1]?.id ?? null
}

watch(open, (isOpen) => {
  if (isOpen)
    resetEvents()
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
            <Button class="w-full" size="sm" @click="addEvent">
              <Plus class="size-4" aria-hidden="true" />
              新增事件
            </Button>
          </div>
          <div class="min-h-0 flex-1 space-y-1 overflow-auto p-2">
            <button
              v-for="event in events"
              :key="event.id"
              type="button"
              class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :class="event.id === selectedEventId && 'bg-accent text-accent-foreground'"
              @click="selectedEventId = event.id"
            >
              <span class="block truncate font-medium">{{ event.name }}</span>
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
              <Label for="event-type">事件类型</Label>
              <Select v-model="selectedEvent.type">
                <SelectTrigger id="event-type" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="eventType in eventTypes" :key="eventType.value" :value="eventType.value">
                    {{ eventType.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="event-name">事件名称</Label>
              <Input id="event-name" v-model="selectedEvent.name" />
            </div>

            <div class="space-y-2">
              <Label for="event-handler">事件函数体</Label>
              <textarea
                id="event-handler"
                v-model="selectedEvent.handler"
                class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-48 w-full resize-y rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none focus-visible:ring-3"
                spellcheck="false"
              />
            </div>
          </div>
        </section>

        <div v-else class="flex min-h-0 items-center justify-center p-4 text-sm text-muted-foreground">
          暂无事件
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
