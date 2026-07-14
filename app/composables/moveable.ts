import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'
import type Moveable from 'vue3-moveable'
import { ATTR_NODE_ID } from '~/constants'

export function useMoveable(moveableRef: Ref<Moveable | null>) {
  const editorStore = useEditorStore()
  const { nodes } = storeToRefs(editorStore)

  function getNodeByTarget(target: HTMLElement) {
    const id = target.getAttribute(ATTR_NODE_ID)
    if (id)
      return editorStore.findNodeById(id)
    return null
  }

  function onDrag(e: OnDrag) {
    e.target.style.left = `${e.left}px`
    e.target.style.top = `${e.top}px`

    const node = getNodeByTarget(e.target as HTMLElement)
    if (node) {
      node.layout.x = e.left
      node.layout.y = e.top
    }
  }

  function onResize(e: OnResize) {
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`

    const node = getNodeByTarget(e.target as HTMLElement)
    if (node) {
      node.layout.width = e.width
      node.layout.height = e.height
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
    { flush: 'post' },
  )

  return {
    onDrag,
    onResize,
    onDragGroup,
    onResizeGroup,
  }
}
