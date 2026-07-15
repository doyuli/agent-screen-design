<script setup lang="ts">
import CanvasProperty from './properties/CanvasProperty.vue'
import NodeProperty from './properties/NodeProperty.vue'

const editorStore = useEditorStore()
const { selectedNode, pageSchema } = storeToRefs(editorStore)

const currentNode = computed(() => selectedNode.value ?? pageSchema.value)
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-l bg-sidebar text-sidebar-foreground">
    <div class="border-b px-4 py-3">
      <div class="flex items-center justify-between h-6">
        <h2 class="text-sm font-semibold">
          属性
        </h2>
        <span class="text-xs text-muted-foreground">{{ currentNode.type }}</span>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">
        {{ currentNode.name }}
      </p>
    </div>
    <CanvasProperty v-if="currentNode.type === 'page'" />
    <NodeProperty v-else />
  </aside>
</template>
