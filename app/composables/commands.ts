import type { MaterialSchema } from '~~/shared/schema/material'

export interface Command {
  key: string
  label: string | ((node: MaterialSchema) => string)
  onClick: (node: MaterialSchema) => void
  isVisible?: (index: number, total: number) => boolean
}

export function useCommands() {
  const editorStore = useEditorStore()
  const { nodes } = storeToRefs(editorStore)

  const commands: Command[] = [
    {
      label: '复制',
      key: 'copy',
      onClick: node => editorStore.copyNode(node),
    },
    {
      label: '移除',
      key: 'remove',
      onClick: node => editorStore.removeNode(node),
    },
    {
      label: '置顶',
      key: 'move-to-top',
      isVisible: (index, total) => index < total - 1,
      onClick: node => editorStore.moveNodeToTop(node),
    },
    {
      label: '置底',
      key: 'move-to-bottom',
      isVisible: index => index > 0,
      onClick: node => editorStore.moveNodeToBottom(node),
    },
    {
      label: node => node.locked ? '解锁' : '锁定',
      key: 'toggle-lock',
      onClick: node => editorStore.toggleNodeLock(node),
    },
  ]

  const getCommands = (node: MaterialSchema) => {
    const index = nodes.value.findIndex(item => item.id === node.id)
    const total = nodes.value.length
    return commands.filter(command => command.isVisible?.(index, total) ?? true)
  }

  return {
    getCommands,
  }
}
