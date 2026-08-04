import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { defineStore } from 'pinia'
import { useUndoRedo } from '~/composables/undo-redo'
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
    dataSources: [],
  })

  const nodes = computed({
    get: () => pageSchema.value.nodes,
    set: value => (pageSchema.value.nodes = value),
  })
  const canvas = computed({
    get: () => pageSchema.value.canvas,
    set: value => (pageSchema.value.canvas = value),
  })
  const dataSources = computed({
    get: () => pageSchema.value.dataSources,
    set: value => (pageSchema.value.dataSources = value),
  })
  const canvasScale = ref(1)

  const selectedNodeIds = ref<string[]>([])
  const selectedNodeId = computed(() => selectedNodeIds.value.length === 1 ? selectedNodeIds.value[0] : null)
  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value))

  const { applyChange, clearUndoRedoStack } = useUndoRedo()

  function stepCanvasScale(step: number) {
    canvasScale.value += step
  }

  function replaceNodes(value: MaterialSchema[]) {
    applyChange(pageSchema.value, 'nodes', value)
  }

  function addNode(node: MaterialSchema) {
    replaceNodes([...nodes.value, node])
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
    applyChange(node, 'locked', !node.locked)
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
    replaceNodes(nodes.value.filter(n => n.id !== node.id))
    selectedNodeIds.value = selectedNodeIds.value.filter(id => id !== node.id)
  }

  function moveNodeToTop(node: MaterialSchema) {
    const filteredNodes = nodes.value.filter(n => n.id !== node.id)
    replaceNodes([...filteredNodes, node])
  }

  function moveNodeToBottom(node: MaterialSchema) {
    const filteredNodes = nodes.value.filter(n => n.id !== node.id)
    replaceNodes([node, ...filteredNodes])
  }

  function setPageSchema(schema: PageSchema) {
    pageSchema.value = schema
    clearUndoRedoStack()
    clearSelectedNode()
  }

  return {
    panelCollapsed,
    pageSchema,
    nodes,
    canvas,
    dataSources,
    canvasScale,
    selectedNodeId,
    selectedNodeIds,
    selectedNode,
    findNodeById,
    replaceNodes,
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
    setPageSchema,
  }
})
