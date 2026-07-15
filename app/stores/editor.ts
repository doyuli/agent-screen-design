import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelCollapsed = reactive({
    material: false,
    layer: false,
    property: false,
  })

  const pageSchema = ref<PageSchema>({
    name: '城市运营大屏',
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: '#07111f',
    },
    nodes: [],
  })

  const nodes = toRef(pageSchema.value, 'nodes')
  const canvas = toRef(pageSchema.value, 'canvas')
  const canvasScale = ref(1)

  const selectedNodeIds = ref<string[]>([])
  const selectedNodeId = computed(() => selectedNodeIds.value.length === 1 ? selectedNodeIds.value[0] : null)
  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value))

  function stepCanvasScale(step: number) {
    canvasScale.value += step
  }

  function addNode(node: MaterialSchema) {
    nodes.value.push(node)
  }

  function findNodeById(id: string) {
    return nodes.value.find(node => node.id === id)
  }

  function selectNodesById(ids: string[]) {
    selectedNodeIds.value = ids
  }

  function selectNodeById(id: string) {
    selectedNodeIds.value = [id]
  }

  function clearSelectedNode() {
    selectedNodeIds.value = []
  }

  function toggleNodeLock(node: MaterialSchema) {
    node.locked = !node.locked
  }

  return {
    panelCollapsed,
    pageSchema,
    nodes,
    canvas,
    canvasScale,
    selectedNodeId,
    selectedNodeIds,
    selectedNode,
    findNodeById,
    addNode,
    selectNodeById,
    selectNodesById,
    clearSelectedNode,
    toggleNodeLock,
    stepCanvasScale,
  }
})
