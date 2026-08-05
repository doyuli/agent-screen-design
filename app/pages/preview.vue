<script setup lang="ts">
import ScreenRenderer from '~/components/ScreenRenderer.vue'

const editorStore = useEditorStore()
const { pageSchema } = storeToRefs(editorStore)
</script>

<template>
  <ScreenRenderer :schema="pageSchema" />
</template>
