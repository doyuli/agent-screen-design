import type { ApiDataSourceSchema, DataSourceSchema } from '~~/shared/schema/page'
import { createContext } from 'reka-ui'
import { dataSourceTypeSchema } from '~~/shared/schema/page'
import { getValue } from '@/utils'

interface DataSourceContext {
  dataSources: Ref<DataSourceSchema[]>
}

const [injectDataSource, provideDataSource] = createContext<DataSourceContext>('dataSource')

export function useDataSource(dataSourceId: Ref<string | undefined>) {
  const dataSources = injectDataSource().dataSources

  const source = computed(() => dataSources.value.find(source => source.id === dataSourceId.value))

  const data = ref<unknown>(null)
  const error = ref<unknown>(null)
  const loading = ref(false)

  let timer: ReturnType<typeof setTimeout> | undefined
  let requestVersion = 0
  let disposed = false

  async function loadData() {
    const version = ++requestVersion
    const currentSource = source.value
    if (!currentSource) {
      data.value = null
      error.value = null
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    if (currentSource.type === dataSourceTypeSchema.enum.static) {
      data.value = currentSource.data
      loading.value = false
    }
    else if (currentSource.type === dataSourceTypeSchema.enum.api) {
      try {
        const result = await fetchData(currentSource)
        if (isCurrentRequest(version))
          data.value = result
      }
      catch (err) {
        if (isCurrentRequest(version)) {
          error.value = err
          data.value = null
        }
      }
      finally {
        if (isCurrentRequest(version)) {
          loading.value = false

          if (currentSource.interval) {
            timer = setTimeout(loadData, currentSource.interval)
          }
        }
      }
    }
  }

  function isCurrentRequest(version: number) {
    return !disposed && version === requestVersion
  }

  function clearTimer() {
    timer && clearTimeout(timer)
    timer = undefined
  }

  watch([dataSourceId, dataSources], () => {
    clearTimer()
    loadData()
  }, { immediate: true })

  onBeforeUnmount(() => {
    disposed = true
    ++requestVersion
    clearTimer()
  })

  return {
    data,
    error,
    loading,
    refresh: loadData,
  }
}

const FETCH_PROMISE_CACHE = new Map<string, Promise<unknown>>()

export function fetchData(source: ApiDataSourceSchema) {
  const { url, method, headers = {}, params = {} } = source

  const fetchOptions = createFetchOptions(method, url, headers, params)

  const cacheKey = JSON.stringify({ fetchOptions, responsePath: source.responsePath })

  if (FETCH_PROMISE_CACHE.has(cacheKey)) {
    return FETCH_PROMISE_CACHE.get(cacheKey)
  }

  const promise = fetch(fetchOptions.url, fetchOptions.options)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = await response.json()

      if (source.responsePath) {
        return getValue(data, source.responsePath)
      }

      return data
    })
    .finally(() => {
      FETCH_PROMISE_CACHE.delete(cacheKey)
    })

  FETCH_PROMISE_CACHE.set(cacheKey, promise)

  return promise
}

function createFetchOptions(
  method: 'GET' | 'POST',
  url: string,
  headers: Record<string, string>,
  params: Record<string, unknown>,
) {
  const baseHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  const buildQueryUrl = (url: string, params: Record<string, unknown>) => {
    const entries = Object.entries(params)
    if (entries.length === 0)
      return url

    return `${url}?${new URLSearchParams(entries.map(([key, value]) => [key, String(value)]))}`
  }

  if (method === 'GET') {
    return {
      url: buildQueryUrl(url, params),
      options: {
        method,
        headers: baseHeaders,
      },
    }
  }

  return {
    url,
    options: {
      method,
      headers: baseHeaders,
      body: JSON.stringify(params),
    },
  }
}

export {
  provideDataSource,
}
