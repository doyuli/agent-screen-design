import type { TemplateRef } from 'vue'
import type Moveable from 'vue3-moveable'
import type { Material } from '~~/shared/schema/material'
import { ATTR_NODE_ID, ATTR_NODE_LOCKED } from '~/constants'

interface UseSelectionOptions {
  stageRef: TemplateRef<HTMLElement>
  moveableRef: TemplateRef<Moveable>
}

export function useSelection({ stageRef, moveableRef }: UseSelectionOptions) {
  const selectedTarget = shallowRef<HTMLElement[]>([])

  const editorStore = useEditorStore()
  const { selectedNodeIds } = storeToRefs(editorStore)
  watch(
    selectedNodeIds,
    (ids) => {
      if (!stageRef.value)
        return

      selectedTarget.value = ids.map(
        id => stageRef.value?.querySelector(
          `[${ATTR_NODE_ID}='${id}']:not([${ATTR_NODE_LOCKED}='true'])`,
        ) as HTMLElement,
      )
    },
    { deep: true, flush: 'post' },
  )

  function onSelect(node: Material, event: MouseEvent) {
    editorStore.selectNodeById(node.id)

    nextTick(() => {
      moveableRef.value?.dragStart(event)
    })
  }

  function onClearSelected() {
    editorStore.clearSelectedNode()
  }

  function onSelectEnd(event: any) {
    const ids = event.selected.map((e: HTMLElement) => e.getAttribute(ATTR_NODE_ID))
    editorStore.selectNodesById(ids)
  }

  return {
    onSelect,
    onClearSelected,
    onSelectEnd,
    selectedTarget,
  }
}
