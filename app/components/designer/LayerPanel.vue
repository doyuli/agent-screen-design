<script setup lang="ts">
import { Eye, GripVertical, Lock, MoreHorizontal } from '@lucide/vue'
import { useDraggable } from 'vue-draggable-plus'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const editorStore = useEditorStore()
const { selectedNodeIds, nodes } = storeToRefs(editorStore)

const layerPanelRef = useTemplateRef<HTMLDivElement>('layer-panel')

useDraggable(layerPanelRef, nodes, { animation: 150, direction: 'horizontal' })
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-r bg-background">
    <div class="border-b px-4 py-3">
      <div class="flex items-center justify-between h-6">
        <h2 class="text-sm font-semibold">
          图层
        </h2>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal class="size-4" aria-hidden="true" />
          <span class="sr-only">图层操作</span>
        </Button>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">
        管理画布元素顺序
      </p>
    </div>

    <ScrollArea class="min-h-0 flex-1">
      <div ref="layer-panel" class="p-2 flex flex-col-reverse gap-1 justify-start">
        <button
          v-for="node in nodes"
          :key="node.id"
          :data-active="selectedNodeIds.includes(node.id)"
          class="group flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          @click="editorStore.selectNodeById(node.id)"
        >
          <GripVertical class="size-3.5 text-muted-foreground group-data-[active=true]:text-primary-foreground/70" aria-hidden="true" />
          <span class="min-w-0 flex-1 truncate">{{ node.name }}</span>
          <span class="text-[10px] text-muted-foreground group-data-[active=true]:text-primary-foreground/70">
            {{ node.type }}
          </span>
          <component
            :is="node.locked ? Lock : Eye"
            class="size-3.5 text-muted-foreground group-data-[active=true]:text-primary-foreground/70"
            aria-hidden="true"
            @click.stop="editorStore.toggleNodeLock(node)"
          />
        </button>
      </div>
    </ScrollArea>
  </aside>
</template>
