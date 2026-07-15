import type { TemplateRef } from 'vue'
import type Moveable from 'vue3-moveable'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

interface UseCanvasRulerOptions {
  canvasRootRef: TemplateRef<HTMLElement>
  moveableRef: TemplateRef<Moveable>
}

interface RulerZoomChange {
  scale: number
  dimsOut?: {
    elem: Pick<DOMRect, 'left' | 'top'>
  }
}

export function useCanvasRuler({ canvasRootRef, moveableRef }: UseCanvasRulerOptions) {
  const editorStore = useEditorStore()
  const { canvas } = storeToRefs(editorStore)

  const canvasWidth = computed(() => canvas.value.width)
  const canvasHeight = computed(() => canvas.value.height)
  const canvasScale = computed(() => editorStore.canvasScale)
  const canvasStyle = computed(() => ({
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    backgroundColor: canvas.value.backgroundColor,
  }))

  const lines = ref({ h: [], v: [] })
  const canvasTransform = ref({ x: 0, y: 0 })
  const rulerGuidelines = computed(() => ({
    horizontal: lines.value.h.map(y => canvasTransform.value.y + y * canvasScale.value),
    vertical: lines.value.v.map(x => canvasTransform.value.x + x * canvasScale.value),
  }))

  const palette = {
    bgColor: 'transparent',
    longfgColor: '#94a3b8',
    fontColor: '#64748b',
    fontShadowColor: '#0ea5e9',
    shadowColor: 'transparent',
    lineColor: '#0ea5e9',
    lineType: 'dashed',
    lockLineColor: '#94a3b8',
    borderColor: '#e2e8f0',
    hoverBg: 'transparent',
    hoverColor: '#0f172a',
    cornerActiveColor: '#0ea5e9',
  }

  const rectWidth = ref(0)
  const rectHeight = ref(0)
  function updateRectSize(rect: DOMRect) {
    rectWidth.value = Math.floor(rect.width)
    rectHeight.value = Math.floor(rect.height)
  }
  const onRootResize = useDebounceFn(updateRectSize, 300)
  useResizeObserver(canvasRootRef, ([entry]) => {
    const rect = entry?.contentRect
    if (rect)
      onRootResize(rect)
  })
  onMounted(() => {
    const rect = canvasRootRef.value?.getBoundingClientRect()
    if (rect)
      updateRectSize(rect)
  })

  function onZoomChange({ dimsOut }: RulerZoomChange) {
    const rootRect = canvasRootRef.value?.getBoundingClientRect()
    if (rootRect && dimsOut) {
      canvasTransform.value = {
        x: dimsOut.elem.left - rootRect.left,
        y: dimsOut.elem.top - rootRect.top,
      }
    }

    moveableRef.value?.updateRect()
  }

  return {
    canvas,
    canvasWidth,
    canvasHeight,
    canvasStyle,
    rectWidth,
    rectHeight,
    lines,
    rulerGuidelines,
    palette,
    onZoomChange,
  }
}
