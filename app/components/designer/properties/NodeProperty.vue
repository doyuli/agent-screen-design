<script setup lang="ts">
import { AlignCenter, Database, Paintbrush } from '@lucide/vue'
import { FormBuilder } from '@/components/form'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMaterialFields } from '~/materials'
import LayoutProperty from './LayoutProperty.vue'

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const styleFields = computed(() => getMaterialFields(selectedNode.value!.type))

const activeTab = ref('style')
</script>

<template>
  <Tabs v-model="activeTab" class="min-h-0 flex-1 gap-0">
    <div class="border-b px-3 py-2">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="layout">
          <AlignCenter class="size-3.5" aria-hidden="true" />
        </TabsTrigger>
        <TabsTrigger value="style">
          <Paintbrush class="size-3.5" aria-hidden="true" />
        </TabsTrigger>
        <TabsTrigger value="data-base">
          <Database class="size-3.5" aria-hidden="true" />
        </TabsTrigger>
      </TabsList>
    </div>

    <ScrollArea class="min-h-0 flex-1">
      <TabsContent value="layout" class="m-0 space-y-5 p-4">
        <LayoutProperty />
      </TabsContent>

      <TabsContent value="style" class="m-0 space-y-5 p-4">
        <FormBuilder :fields="styleFields" :form-data="selectedNode!" />
      </TabsContent>

      <TabsContent value="data-base" class="m-0 space-y-5 p-4">
        <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
          <Label for="data-source" class="text-sm">数据源</Label>
          <Switch id="data-source" />
        </div>
      </TabsContent>
    </ScrollArea>
  </Tabs>
</template>
