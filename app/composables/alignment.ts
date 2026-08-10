import type { Component } from 'vue'
import type { MaterialSchema } from '~~/shared/schema/material'
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalSpaceBetween,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalSpaceBetween,
} from '@lucide/vue'
import { computed } from 'vue'
import { useUndoRedo } from './undo-redo'

export type AlignmentAction
  = | 'align-left'
    | 'align-horizontal-center'
    | 'align-right'
    | 'align-top'
    | 'align-vertical-center'
    | 'align-bottom'
    | 'distribute-horizontal'
    | 'distribute-vertical'

type AlignmentNode = Pick<MaterialSchema, 'id' | 'layout'>

interface AlignmentActionItem {
  action: AlignmentAction
  icon: Component
  label: string
}

export const distributionActions: Array<AlignmentActionItem> = [
  { action: 'distribute-horizontal', icon: AlignHorizontalSpaceBetween, label: '横向等距分布' },
  { action: 'distribute-vertical', icon: AlignVerticalSpaceBetween, label: '纵向等距分布' },
]

export const controlActions: Array<AlignmentActionItem> = [
  { action: 'align-left', icon: AlignStartVertical, label: '左对齐' },
  { action: 'align-horizontal-center', icon: AlignCenterVertical, label: '水平居中' },
  { action: 'align-right', icon: AlignEndVertical, label: '右对齐' },
  { action: 'align-top', icon: AlignStartHorizontal, label: '顶对齐' },
  { action: 'align-vertical-center', icon: AlignCenterHorizontal, label: '垂直居中' },
  { action: 'align-bottom', icon: AlignEndHorizontal, label: '底对齐' },
]

export const alignmentActions: Array<AlignmentActionItem> = [
  ...controlActions,
  ...distributionActions,
]

export function useAlignment() {
  const editorStore = useEditorStore()
  const { nodes, selectedNodeIds } = storeToRefs(editorStore)
  const { applyChange, commitBatch, startBatch } = useUndoRedo()

  const nodeMap = computed(() => new Map(nodes.value.map(node => [node.id, node])))

  const selectedNodes = computed(
    () => selectedNodeIds.value.map(id => nodeMap.value.get(id)).filter((node): node is MaterialSchema => Boolean(node && !node.locked)),
  )

  const canAlign = computed(() => selectedNodes.value.length >= 2)
  const canDistribute = computed(() => selectedNodes.value.length >= 3)

  function align(action: AlignmentAction) {
    if (!canAlign.value || (isDistributionAction(action) && !canDistribute.value))
      return

    const changes = getAlignedLayouts(selectedNodes.value, action)
      .flatMap(({ id, layout }) => {
        const node = editorStore.findNodeById(id)
        if (!node)
          return []

        if (node.layout.x === layout.x && node.layout.y === layout.y) {
          return []
        }

        return [{ node, layout }]
      })

    if (!changes.length)
      return

    startBatch()
    changes.forEach(({ node, layout }) => applyChange(node, 'layout', layout))
    commitBatch()
  }

  return {
    align,
    canAlign,
    canDistribute,
  }
}

interface LayoutBounds {
  left: number
  right: number
  top: number
  bottom: number
}

function getLayoutBounds(nodes: AlignmentNode[]) {
  return {
    left: Math.min(...nodes.map(node => node.layout.x)),
    right: Math.max(...nodes.map(node => node.layout.x + node.layout.width)),
    top: Math.min(...nodes.map(node => node.layout.y)),
    bottom: Math.max(...nodes.map(node => node.layout.y + node.layout.height)),
  }
}

function isDistributionAction(action: AlignmentAction) {
  return action === 'distribute-horizontal' || action === 'distribute-vertical'
}

function cloneLayouts(nodes: MaterialSchema[]) {
  return nodes.map(node => ({ id: node.id, layout: { ...node.layout } }))
}

function getAlignedLayouts(
  nodes: MaterialSchema[],
  action: AlignmentAction,
) {
  const alignedNodes = cloneLayouts(nodes)
  const bounds = getLayoutBounds(alignedNodes)

  switch (action) {
    case 'align-left':
      alignedNodes.forEach(node => (node.layout.x = bounds.left))
      break
    case 'align-horizontal-center':
      alignedNodes.forEach(node => (node.layout.x = (bounds.left + bounds.right - node.layout.width) / 2))
      break
    case 'align-right':
      alignedNodes.forEach(node => (node.layout.x = bounds.right - node.layout.width))
      break
    case 'align-top':
      alignedNodes.forEach(node => (node.layout.y = bounds.top))
      break
    case 'align-vertical-center':
      alignedNodes.forEach(node => (node.layout.y = (bounds.top + bounds.bottom - node.layout.height) / 2))
      break
    case 'align-bottom':
      alignedNodes.forEach(node => (node.layout.y = bounds.bottom - node.layout.height))
      break
    case 'distribute-horizontal':
      distributeHorizontally(alignedNodes, bounds)
      break
    case 'distribute-vertical':
      distributeVertically(alignedNodes, bounds)
      break
  }

  return alignedNodes
}

function distributeHorizontally(
  nodes: AlignmentNode[],
  bounds: LayoutBounds,
) {
  const orderedNodes = nodes
    .map((node, index) => ({ node, index }))
    .sort((a, b) => a.node.layout.x - b.node.layout.x || a.index - b.index)
  const totalWidth = orderedNodes.reduce((total, { node }) => total + node.layout.width, 0)
  const gap = (bounds.right - bounds.left - totalWidth) / (orderedNodes.length - 1)
  let x = bounds.left

  orderedNodes.forEach(({ node }) => {
    node.layout.x = x
    x += node.layout.width + gap
  })
}

function distributeVertically(
  nodes: AlignmentNode[],
  bounds: LayoutBounds,
) {
  const orderedNodes = nodes
    .map((node, index) => ({ node, index }))
    .sort((a, b) => a.node.layout.y - b.node.layout.y || a.index - b.index)
  const totalHeight = orderedNodes.reduce((total, { node }) => total + node.layout.height, 0)
  const gap = (bounds.bottom - bounds.top - totalHeight) / (orderedNodes.length - 1)
  let y = bounds.top

  orderedNodes.forEach(({ node }) => {
    node.layout.y = y
    y += node.layout.height + gap
  })
}
