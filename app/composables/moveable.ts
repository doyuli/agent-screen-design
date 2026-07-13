import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'
import type Moveable from 'vue3-moveable'
import type { Material } from '~~/shared/schema/material'

export function useMoveable(
  moveableRef: Ref<Moveable | null>,
  nodes: Ref<Material[]>,
) {
  watch(
    () => nodes.value.map(node => node.layout),
    () => moveableRef.value?.updateRect(undefined, true),
    {
      flush: 'post',
    },
  )

  function onDrag(e: OnDrag) {
    e.target.style.left = `${e.left}px`
    e.target.style.top = `${e.top}px`

    const id = e.target.getAttribute('data-node-id')
    const node = nodes.value.find(node => node.id === id)
    if (node) {
      node.layout.x = e.left
      node.layout.y = e.top
    }
  }

  function onResize(e: OnResize) {
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`

    const id = e.target.getAttribute('data-node-id')
    const node = nodes.value.find(node => node.id === id)
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

  return {
    onDrag,
    onResize,
    onDragGroup,
    onResizeGroup,
  }
}
