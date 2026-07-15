import type { MaterialSchema } from '~~/shared/schema/material'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelCollapsed = reactive({
    material: false,
    layer: false,
    property: false,
  })

  const nodes = ref<MaterialSchema[]>([])

  const selectedNodeIds = ref<string[]>([])
  const selectedNodeId = computed(() => selectedNodeIds.value.length === 1 ? selectedNodeIds.value[0] : null)
  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value))

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
    nodes,
    selectedNodeId,
    selectedNodeIds,
    selectedNode,
    findNodeById,
    addNode,
    selectNodeById,
    selectNodesById,
    clearSelectedNode,
    toggleNodeLock,
  }
})
