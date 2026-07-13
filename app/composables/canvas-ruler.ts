import type Moveable from 'vue3-moveable'
import { useDebounceFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface UseCanvasRulerOptions {
  canvasRootRef: { value: HTMLElement | null }
  moveableRef: { value: Moveable | null }
}

export function useCanvasRuler({ canvasRootRef, moveableRef }: UseCanvasRulerOptions) {
  const canvas = ref({
    width: 1920,
    height: 1080,
    backgroundColor: '#07111f',
  })
  const canvasWidth = computed(() => canvas.value.width)
  const canvasHeight = computed(() => canvas.value.height)
  const canvasStyle = computed(() => ({
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    backgroundColor: canvas.value.backgroundColor,
  }))
  const lines = ref({ h: [], v: [] })
  const rectWidth = ref(0)
  const rectHeight = ref(0)
  const scale = ref(1)
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
  const onRootResize = useDebounceFn((rect: DOMRectReadOnly) => {
    rectWidth.value = Math.floor(rect.width)
    rectHeight.value = Math.floor(rect.height)
  }, 300)

  let observer: ResizeObserver | undefined

  onMounted(() => {
    const root = canvasRootRef.value
    if (!root)
      return

    const rect = root.getBoundingClientRect()
    rectWidth.value = Math.floor(rect.width)
    rectHeight.value = Math.floor(rect.height)

    observer = new ResizeObserver(([entry]) => {
      if (entry)
        onRootResize(entry.contentRect)
    })
    observer.observe(root)
  })

  onUnmounted(() => observer?.disconnect())

  function onZoomChange() {
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
    scale,
    palette,
    onZoomChange,
  }
}
