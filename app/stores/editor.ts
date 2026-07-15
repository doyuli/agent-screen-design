import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { defineStore } from 'pinia'
import { deepClone } from '~/utils'

export const useEditorStore = defineStore('editor', () => {
  const panelCollapsed = reactive({
    material: false,
    layer: true,
    property: false,
  })

  const pageSchema = ref<PageSchema>({
    name: '城市运营大屏',
    type: 'page',
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
    if (node.locked)
      clearSelectedNode()
  }

  function copyNode(node: MaterialSchema, offset = 20) {
    const newNode = deepClone(node)
    newNode.id = crypto.randomUUID()
    newNode.layout.x += offset
    newNode.layout.y += offset
    addNode(newNode)
    selectNodeById(newNode.id)
  }

  function removeNode(node: MaterialSchema) {
    nodes.value = nodes.value.filter(n => n.id !== node.id)
    selectedNodeIds.value = selectedNodeIds.value.filter(id => id !== node.id)
  }

  function moveNodeToTop(node: MaterialSchema) {
    nodes.value = nodes.value.filter(n => n.id !== node.id)
    nodes.value.push(node)
  }

  function moveNodeToBottom(node: MaterialSchema) {
    nodes.value = nodes.value.filter(n => n.id !== node.id)
    nodes.value.unshift(node)
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
    copyNode,
    removeNode,
    moveNodeToTop,
    moveNodeToBottom,
    selectNodeById,
    selectNodesById,
    clearSelectedNode,
    toggleNodeLock,
    stepCanvasScale,
  }
})
