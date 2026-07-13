<script setup lang="ts">
import type { MaterialDefinition, MaterialGroup } from '~~/shared/schema/material'
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { DATA_TRANSFER_KEY } from '~/constants'
import { getAllMaterials, getMaterialGroups, getMaterialsByGroup } from '~/materials'

const materialGroups = getMaterialGroups()
const activeGroup = ref<MaterialGroup>(materialGroups[0]?.key ?? 'basics')

function onDragStart(schema: MaterialDefinition['schema'], e: DragEvent) {
  e.dataTransfer?.setData(DATA_TRANSFER_KEY, JSON.stringify(schema))
}
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground">
    <div class="border-b px-4 py-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">
          物料
        </h2>
        <Badge variant="secondary" class="rounded-md">
          {{ getAllMaterials().length }}
        </Badge>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">
        选择组件添加到画布
      </p>
    </div>

    <Tabs v-model="activeGroup" class="min-h-0 flex-1 gap-0">
      <div class="border-b px-3 py-2">
        <TabsList class="flex w-full">
          <TabsTrigger v-for="group in materialGroups" :key="group.key" :value="group.key">
            {{ group.name }}
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea class="min-h-0 flex-1">
        <div class="p-3">
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="material in getMaterialsByGroup(activeGroup)"
              :key="material.schema.type"
              variant="outline"
              class="h-22 flex-col items-stretch justify-between rounded-md border-border bg-background p-2.5 text-left shadow-none hover:bg-background/10"
              draggable="true"
              @dragstart="onDragStart(material.schema, $event)"
            >
              <span class="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <component :is="material.icon" class="size-4" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-medium leading-none">{{ material.schema.name }}</span>
                <span v-if="material.schema.description" class="mt-1 block text-[11px] leading-none text-muted-foreground">
                  {{ material.schema.description }}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Tabs>
  </aside>
</template>
