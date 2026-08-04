<script setup lang="ts">
import type { DataSourceSchema } from '~~/shared/schema/page'
import { Database, Plus, Save, Trash2 } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { dataSourceSchema, dataSourceTypeSchema } from '~~/shared/schema/page'
import MonacoEditor from '@/components/MonacoEditor.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { parseOptionalObjectJson, safeJsonParse, serializeJson } from '~/utils/parser'

const open = defineModel<boolean>('open', { default: false })

const editorStore = useEditorStore()
const { dataSources } = storeToRefs(editorStore)

const draftDataSources = ref<DataSourceSchema[]>([])
const selectedDataSourceId = ref<string | null>(null)
const selectedDataSource = computed(() => draftDataSources.value.find(source => source.id === selectedDataSourceId.value))

const dataValue = ref('[]')
const headersValue = ref('')
const paramsValue = ref('')

function syncJsonValues() {
  const source = selectedDataSource.value

  dataValue.value = serializeJson(source?.data ?? [])
  headersValue.value = source?.type === 'api' && source.headers ? serializeJson(source.headers) : ''
  paramsValue.value = source?.type === 'api' && source.params ? serializeJson(source.params) : ''
}

function commitSelectedJson() {
  const source = selectedDataSource.value
  if (!source)
    return true

  const data = safeJsonParse(dataValue.value)
  if (!data.success) {
    toast.error('数据内容不是有效的 JSON')
    return false
  }

  source.data = data.value

  if (source.type !== 'api')
    return true

  const headers = parseOptionalObjectJson(headersValue.value)
  if (!headers.success) {
    toast.error('请求头不是有效的 JSON')
    return false
  }
  source.headers = headers.value

  const params = parseOptionalObjectJson(paramsValue.value)
  if (!params.success) {
    toast.error('请求参数不是有效的 JSON')
    return false
  }
  source.params = params.value

  if (typeof source.interval !== 'number')
    source.interval = undefined

  return true
}

function addDataSource() {
  if (!commitSelectedJson())
    return

  const source: DataSourceSchema = {
    id: crypto.randomUUID(),
    name: `新数据源 ${draftDataSources.value.length + 1}`,
    type: 'static',
    data: [],
  }

  draftDataSources.value.push(source)
  selectedDataSourceId.value = source.id
  syncJsonValues()
}

function selectDataSource(id: string) {
  if (id === selectedDataSourceId.value || !commitSelectedJson())
    return

  selectedDataSourceId.value = id
  syncJsonValues()
}

function updateDataSourceType(type: unknown) {
  const parsedType = dataSourceTypeSchema.safeParse(type)
  if (!parsedType.success)
    return

  if (!commitSelectedJson())
    return

  const source = selectedDataSource.value
  if (!source || source.type === parsedType.data)
    return

  const index = draftDataSources.value.findIndex(item => item.id === source.id)

  const base = { id: source.id, name: source.name, data: source.data }

  draftDataSources.value[index]
    = parsedType.data === 'api'
      ? { ...base, type: parsedType.data, url: '', method: 'GET' }
      : { ...base, type: parsedType.data }

  syncJsonValues()
}

function removeSelectedDataSource() {
  const index = draftDataSources.value.findIndex(source => source.id === selectedDataSourceId.value)
  if (index === -1)
    return

  draftDataSources.value.splice(index, 1)
  selectedDataSourceId.value = draftDataSources.value[index]?.id ?? draftDataSources.value[index - 1]?.id ?? null
  syncJsonValues()
}

function saveDataSources() {
  if (!commitSelectedJson())
    return

  const result = dataSourceSchema.array().safeParse(draftDataSources.value)
  if (!result.success) {
    toast.error(result.error.issues[0]?.message ?? '数据源配置不符合 Schema 要求')
    return
  }

  dataSources.value = result.data
  open.value = false
}

function cloneDataSource(source: DataSourceSchema): DataSourceSchema {
  if (source.type === 'api') {
    return {
      ...source,
      headers: source.headers ? { ...source.headers } : undefined,
      params: source.params ? { ...source.params } : undefined,
    }
  }

  return { ...source }
}

watch(open, (isOpen) => {
  if (!isOpen)
    return

  draftDataSources.value = dataSources.value.map(cloneDataSource)
  selectedDataSourceId.value = draftDataSources.value[0]?.id ?? null
  syncJsonValues()
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[min(48rem,calc(100vw-1rem))] gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b pr-12">
        <SheetTitle>数据源</SheetTitle>
        <SheetDescription>管理页面的静态数据和接口请求</SheetDescription>
      </SheetHeader>

      <div class="grid min-h-0 flex-1 md:grid-cols-[12rem_minmax(0,1fr)]">
        <section class="flex min-h-0 flex-col border-b md:border-r md:border-b-0">
          <div class="border-b p-3">
            <Button class="w-full" size="sm" @click="addDataSource">
              <Plus class="size-4" aria-hidden="true" />
              新增数据源
            </Button>
          </div>
          <div class="min-h-0 flex-1 space-y-1 overflow-auto p-2">
            <button
              v-for="source in draftDataSources"
              :key="source.id"
              type="button"
              class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :class="source.id === selectedDataSourceId && 'bg-accent text-accent-foreground'"
              @click="selectDataSource(source.id)"
            >
              <span class="block truncate font-medium">{{ source.name }}</span>
              <span class="mt-0.5 block text-xs text-muted-foreground">{{ source.type === 'api' ? 'API 接口' : '静态数据' }}</span>
            </button>
          </div>
        </section>

        <section v-if="selectedDataSource" class="min-h-0 overflow-auto p-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold">
                数据源详情
              </h3>
              <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="removeSelectedDataSource">
                <Trash2 class="size-4" aria-hidden="true" />
                删除
              </Button>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="data-source-name">名称</Label>
                <Input id="data-source-name" v-model="selectedDataSource.name" />
              </div>
              <div class="space-y-2">
                <Label for="data-source-type">类型</Label>
                <Select :model-value="selectedDataSource.type" @update:model-value="updateDataSourceType">
                  <SelectTrigger id="data-source-type" class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">
                      静态数据
                    </SelectItem>
                    <SelectItem value="api">
                      API 接口
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <template v-if="selectedDataSource.type === 'api'">
              <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <div class="space-y-2">
                  <Label for="data-source-url">请求地址</Label>
                  <Input id="data-source-url" v-model="selectedDataSource.url" placeholder="https://api.example.com/data" />
                </div>
                <div class="space-y-2">
                  <Label for="data-source-method">请求方法</Label>
                  <Select v-model="selectedDataSource.method">
                    <SelectTrigger id="data-source-method" class="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">
                        GET
                      </SelectItem>
                      <SelectItem value="POST">
                        POST
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="data-source-interval">轮询间隔（毫秒）</Label>
                <Input id="data-source-interval" v-model.number="selectedDataSource.interval" type="number" min="0" placeholder="留空则不轮询" />
              </div>

              <div class="space-y-2">
                <Label for="data-source-response-path">响应路径</Label>
                <Input id="data-source-response-path" v-model="selectedDataSource.responsePath" placeholder="data.list" />
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <div class="space-y-2">
                  <Label for="data-source-headers">请求头</Label>
                  <div id="data-source-headers" class="h-40 overflow-hidden rounded-md border bg-background py-2">
                    <MonacoEditor v-model="headersValue" placeholder="{'Authorization':'Bearer token'}" />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="data-source-params">请求参数</Label>
                  <div id="data-source-params" class="h-40 overflow-hidden rounded-md border bg-background py-2">
                    <MonacoEditor v-model="paramsValue" placeholder="{'page':1}" />
                  </div>
                </div>
              </div>
            </template>

            <div v-if="selectedDataSource.type === 'static'" class="space-y-2">
              <Label for="data-source-data">数据内容</Label>
              <div id="data-source-data" class="h-80 overflow-hidden rounded-md border bg-background py-2">
                <MonacoEditor v-model="dataValue" />
              </div>
            </div>
          </div>
        </section>

        <div v-else class="flex min-h-0 flex-col items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
          <Database class="size-5" aria-hidden="true" />
          暂无数据源
        </div>
      </div>

      <SheetFooter class="flex-row justify-end border-t sm:justify-end">
        <Button size="sm" @click="saveDataSources">
          <Save class="size-4" aria-hidden="true" />
          保存
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
