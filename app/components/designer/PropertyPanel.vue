<script setup lang="ts">
import type { MaterialEventSchema, MaterialSchema } from '~~/shared/schema/material'
import { Braces, Zap } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import CanvasProperty from './properties/CanvasProperty.vue'
import NodeProperty from './properties/NodeProperty.vue'
import EventConfigSheet from './sheets/EventConfigSheet.vue'
import NodeJsonSheet from './sheets/NodeJsonSheet.vue'

const editorStore = useEditorStore()
const { selectedNode, pageSchema } = storeToRefs(editorStore)

const currentNode = computed(() => selectedNode.value ?? pageSchema.value)
const nodeJsonOpen = ref(false)
const eventConfigOpen = ref(false)

function saveNodeJson(node: MaterialSchema) {
  const selectedNodeValue = selectedNode.value
  if (!selectedNodeValue)
    return

  editorStore.replaceNodes(pageSchema.value.nodes.map(item => item === selectedNodeValue ? node : item))

  if (node.id !== selectedNodeValue.id)
    editorStore.selectNodeById(node.id)

  toast.success('节点配置已保存')
}

function saveNodeEvents(events: MaterialEventSchema[]) {
  if (selectedNode.value)
    selectedNode.value.events = events
}
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-l bg-sidebar text-sidebar-foreground">
    <div class="border-b px-4 py-3">
      <div class="flex h-6 items-center justify-between">
        <h2 class="text-sm font-semibold">
          属性
        </h2>
        <div class="flex items-center gap-1">
          <template v-if="selectedNode">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon-xs" @click="nodeJsonOpen = true">
                  <Braces class="size-3.5" aria-hidden="true" />
                  <span class="sr-only">查看节点 JSON</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                查看节点 JSON
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon-xs" @click="eventConfigOpen = true">
                  <Zap class="size-3.5" aria-hidden="true" />
                  <span class="sr-only">配置事件</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                配置事件
              </TooltipContent>
            </Tooltip>
          </template>
          <span class="text-xs text-muted-foreground">{{ currentNode.type }}</span>
        </div>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">
        {{ currentNode.name }}
      </p>
    </div>
    <CanvasProperty v-if="currentNode.type === 'page'" />
    <NodeProperty v-else />

    <NodeJsonSheet v-model:open="nodeJsonOpen" :node="selectedNode" @save="saveNodeJson" />
    <EventConfigSheet v-model:open="eventConfigOpen" :node="selectedNode" @save="saveNodeEvents" />
  </aside>
</template>
