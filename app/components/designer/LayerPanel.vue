<script setup lang="ts">
import {
  ChevronDown,
  Eye,
  GripVertical,
  Layers2,
  Lock,
  MoreHorizontal,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const layers = [
  { name: '顶部标题组', type: 'Group', active: false, locked: true },
  { name: '实时交易趋势', type: 'LineChart', active: true, locked: false },
  { name: '区域分布地图', type: 'Map', active: false, locked: false },
  { name: '核心指标卡片', type: 'Metric', active: false, locked: false },
  { name: '告警滚动列表', type: 'Table', active: false, locked: false },
  { name: '底部装饰线', type: 'Shape', active: false, locked: true },
]
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col border-r bg-background">
    <div class="border-b px-4 py-3">
      <div class="flex items-center justify-between">
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
      <div class="p-2">
        <div class="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground">
          <ChevronDown class="size-3.5" aria-hidden="true" />
          <Layers2 class="size-3.5" aria-hidden="true" />
          大屏页面
        </div>

        <div class="space-y-1 pl-3">
          <button
            v-for="layer in layers"
            :key="layer.name"
            type="button"
            :data-active="layer.active"
            class="group flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          >
            <GripVertical class="size-3.5 text-muted-foreground group-data-[active=true]:text-primary-foreground/70" aria-hidden="true" />
            <span class="min-w-0 flex-1 truncate">{{ layer.name }}</span>
            <span class="text-[10px] text-muted-foreground group-data-[active=true]:text-primary-foreground/70">
              {{ layer.type }}
            </span>
            <Lock
              v-if="layer.locked"
              class="size-3.5 text-muted-foreground group-data-[active=true]:text-primary-foreground/70"
              aria-hidden="true"
            />
            <Eye
              v-else
              class="size-3.5 text-muted-foreground group-data-[active=true]:text-primary-foreground/70"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </ScrollArea>
  </aside>
</template>
