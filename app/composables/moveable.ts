import type { TemplateRef } from 'vue'
import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'
import type Moveable from 'vue3-moveable'
import { ATTR_NODE_ID } from '~/constants'
import { useUndoRedo } from './undo-redo'

export function useMoveable(moveableRef: TemplateRef<Moveable>) {
  const editorStore = useEditorStore()
  const { nodes } = storeToRefs(editorStore)

  const { startBatch, commitBatch, applyChange } = useUndoRedo()

  function getNodeByTarget(target: HTMLElement) {
    const id = target.getAttribute(ATTR_NODE_ID)
    if (id)
      return editorStore.findNodeById(id)
    return null
  }

  function onStart() {
    startBatch()
  }

  function onEnd() {
    commitBatch()
  }

  function onDrag(e: OnDrag) {
    e.target.style.left = `${e.left}px`
    e.target.style.top = `${e.top}px`

    const node = getNodeByTarget(e.target as HTMLElement)
    if (node) {
      applyChange(node, 'layout', { ...node.layout, x: e.left, y: e.top })
    }
  }

  function onResize(e: OnResize) {
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`

    const node = getNodeByTarget(e.target as HTMLElement)
    if (node) {
      applyChange(node, 'layout', { ...node.layout, width: e.width, height: e.height })
    }

    onDrag(e.drag)
  }

  function onDragGroup(e: OnDragGroup) {
    e.events.forEach(onDrag)
  }

  function onResizeGroup(e: OnResizeGroup) {
    e.events.forEach(onResize)
  }

  watch(
    () => nodes.value.map(node => node.layout),
    () => moveableRef.value?.updateRect(undefined, true),
    { flush: 'post', deep: true },
  )

  return {
    onStart,
    onEnd,
    onDrag,
    onResize,
    onDragGroup,
    onResizeGroup,
  }
}
