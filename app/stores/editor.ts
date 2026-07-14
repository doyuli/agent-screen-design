import type { Material } from '~~/shared/schema/material'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelCollapsed = reactive({
    material: false,
    layer: true,
    property: false,
  })

  const nodes = ref<Material[]>([])

  const selectedNodeIds = ref<string[]>([])
  const selectedNodeId = computed(() => selectedNodeIds.value.length === 1 ? selectedNodeIds.value[0] : null)
  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value))

  function addNode(node: Material) {
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
  }
})
