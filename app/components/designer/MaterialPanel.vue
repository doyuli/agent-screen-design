<script setup lang="ts">
import {
  Activity,
  BarChart3,
  Clock3,
  Gauge,
  Image,
  LineChart,
  Map,
  PieChart,
  Table2,
  TextCursorInput,
} from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const basics = [
  { icon: TextCursorInput, title: '标题文本', meta: '基础' },
  { icon: Image, title: '图片容器', meta: '媒体' },
  { icon: Clock3, title: '时间组件', meta: '状态' },
  { icon: Table2, title: '数据表格', meta: '数据' },
]

const charts = [
  { icon: BarChart3, title: '柱状图', meta: 'ECharts' },
  { icon: LineChart, title: '趋势折线', meta: 'ECharts' },
  { icon: PieChart, title: '环形占比', meta: 'ECharts' },
  { icon: Gauge, title: '仪表盘', meta: '指标' },
]

const scenes = [
  { icon: Map, title: '城市地图', meta: 'GIS' },
  { icon: Activity, title: '实时告警', meta: '业务' },
]
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground">
    <div class="border-b px-4 py-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">
          物料
        </h2>
        <Badge variant="secondary" class="rounded-md">
          10
        </Badge>
      </div>
      <p class="mt-1 text-xs text-muted-foreground">
        选择组件添加到画布
      </p>
    </div>

    <Tabs default-value="basic" class="min-h-0 flex-1 gap-0">
      <div class="border-b px-3 py-2">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="basic">
            基础
          </TabsTrigger>
          <TabsTrigger value="chart">
            图表
          </TabsTrigger>
          <TabsTrigger value="scene">
            场景
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea class="min-h-0 flex-1">
        <TabsContent value="basic" class="m-0 p-3">
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="item in basics"
              :key="item.title"
              variant="outline"
              class="h-24 flex-col items-stretch justify-between rounded-md border-border bg-background p-2.5 text-left shadow-none hover:bg-background/10"
            >
              <span class="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <component :is="item.icon" class="size-4" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-medium leading-none">{{ item.title }}</span>
                <span class="mt-1 block text-[11px] leading-none text-muted-foreground">{{ item.meta }}</span>
              </span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="chart" class="m-0 p-3">
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="item in charts"
              :key="item.title"
              variant="outline"
              class="h-24 flex-col items-stretch justify-between rounded-md border-border bg-background p-2.5 text-left shadow-none hover:bg-background/10"
            >
              <span class="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <component :is="item.icon" class="size-4" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-medium leading-none">{{ item.title }}</span>
                <span class="mt-1 block text-[11px] leading-none text-muted-foreground">{{ item.meta }}</span>
              </span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="scene" class="m-0 p-3">
          <div class="grid gap-2">
            <Button
              v-for="item in scenes"
              :key="item.title"
              variant="outline"
              class="h-20 justify-start rounded-md border-border bg-background p-2.5 text-left shadow-none hover:bg-background/10"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <component :is="item.icon" class="size-4" aria-hidden="true" />
              </span>
              <span class="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span class="truncate text-sm font-medium">{{ item.title }}</span>
                <span class="shrink-0 text-[11px] text-muted-foreground">{{ item.meta }}</span>
              </span>
            </Button>
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  </aside>
</template>
