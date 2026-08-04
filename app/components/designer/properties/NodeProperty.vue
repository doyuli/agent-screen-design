<script setup lang="ts">
import { AlignCenter, Database, Paintbrush, Plus, X } from '@lucide/vue'
import { FormBuilder } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMaterialFields } from '~/materials'
import LayoutProperty from './LayoutProperty.vue'

const editorStore = useEditorStore()
const { selectedNode, dataSources } = storeToRefs(editorStore)

const styleFields = computed(() => getMaterialFields(selectedNode.value!.type))

const activeTab = ref('style')

function clearDataSource() {
  if (selectedNode.value)
    selectedNode.value.dataSourceId = undefined
}
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
        <div class="space-y-2">
          <Label for="data-source" class="text-sm">数据源</Label>
          <template v-if="dataSources.length">
            <div class="flex items-center gap-2">
              <Select v-model="selectedNode!.dataSourceId">
                <SelectTrigger id="data-source" class="min-w-0 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="dataSource in dataSources" :key="dataSource.id" :value="dataSource.id">
                    {{ dataSource.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button v-if="selectedNode!.dataSourceId" variant="ghost" size="icon-sm" aria-label="清除数据源" @click="clearDataSource">
                <X class="size-4" aria-hidden="true" />
              </Button>
            </div>
          </template>
          <Button v-else id="data-source" variant="outline" size="sm" class="w-full" @click="editorStore.openDataSourceSheet()">
            <Plus class="size-4" aria-hidden="true" />
            新增数据源
          </Button>
        </div>
      </TabsContent>
    </ScrollArea>
  </Tabs>
</template>
