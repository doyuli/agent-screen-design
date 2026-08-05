<script setup lang="ts">
import { FileQuestion } from '@lucide/vue'
import ScreenRenderer from '~/components/ScreenRenderer.vue'

const route = useRoute()
const id = route.query.id as string

if (!id) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Screen id is required',
  })
}

const { data: pageSchema, pending } = await useFetch(`/api/screen/${id}`)
</script>

<template>
  <ScreenRenderer v-if="pageSchema" :schema="pageSchema" />
  <section v-else-if="!pending" class="grid min-h-svh place-items-center bg-background p-6 text-foreground">
    <div class="flex max-w-sm flex-col items-center text-center">
      <div class="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <FileQuestion class="size-4" aria-hidden="true" />
      </div>
      <h1 class="mt-3 text-base font-semibold">
        未找到屏幕
      </h1>
      <p class="mt-1 text-sm leading-6 text-muted-foreground">
        该页面不存在或尚未发布
      </p>
    </div>
  </section>
</template>
