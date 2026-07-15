<script setup lang="ts">
import { AlignCenter, Database, Paintbrush } from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
  <Tabs default-value="style" class="min-h-0 flex-1 gap-0">
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
        <div class="space-y-2">
          <Label for="component-name">组件名称</Label>
          <Input id="component-name" model-value="实时交易趋势" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label for="pos-x">X</Label>
            <Input id="pos-x" model-value="480" />
          </div>
          <div class="space-y-2">
            <Label for="pos-y">Y</Label>
            <Input id="pos-y" model-value="264" />
          </div>
          <div class="space-y-2">
            <Label for="width">宽</Label>
            <Input id="width" model-value="820" />
          </div>
          <div class="space-y-2">
            <Label for="height">高</Label>
            <Input id="height" model-value="360" />
          </div>
        </div>
        <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
          <Label for="lock-ratio" class="text-sm">锁定比例</Label>
          <Switch id="lock-ratio" />
        </div>
      </TabsContent>

      <TabsContent value="style" class="m-0 space-y-5 p-4">
        <section class="space-y-3">
          <h3 class="text-sm font-medium">
            标题
          </h3>
          <div class="space-y-2">
            <Label for="chart-title">标题文本</Label>
            <Input id="chart-title" model-value="实时交易趋势" />
          </div>
          <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
            <Label for="show-title" class="text-sm">显示标题</Label>
            <Switch id="show-title" :default-value="true" />
          </div>
        </section>

        <Separator />

        <section class="space-y-3">
          <h3 class="text-sm font-medium">
            图表色板
          </h3>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="color in ['#22d3ee', '#34d399', '#f59e0b', '#60a5fa', '#f472b6']"
              :key="color"
              type="button"
              class="aspect-square rounded-md border shadow-xs"
              :style="{ backgroundColor: color }"
            >
              <span class="sr-only">{{ color }}</span>
            </button>
          </div>
        </section>

        <Separator />

        <section class="space-y-3">
          <h3 class="text-sm font-medium">
            容器
          </h3>
          <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
            <Label for="glass-bg" class="text-sm">半透明背景</Label>
            <Switch id="glass-bg" :default-value="true" />
          </div>
          <div class="flex items-center justify-between rounded-md border bg-background px-3 py-2">
            <Label for="border" class="text-sm">显示边框</Label>
            <Switch id="border" :default-value="true" />
          </div>
        </section>
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
