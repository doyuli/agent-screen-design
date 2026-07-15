import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export type RatioDimension = 'width' | 'height'

interface RatioLockTarget {
  width: number
  height: number
}

export function useRatioLock<T extends RatioLockTarget>(target: Ref<T>) {
  const lockRatio = ref(false)
  let aspectRatio = 1

  function updateDimension(dimension: RatioDimension, value: number) {
    target.value[dimension] = value

    if (!lockRatio.value)
      return

    const pairedDimension = dimension === 'width' ? 'height' : 'width'
    target.value[pairedDimension] = Math.round(
      dimension === 'width' ? value / aspectRatio : value * aspectRatio,
    )
  }

  watch(
    lockRatio,
    (locked) => {
      if (locked)
        aspectRatio = target.value.width / target.value.height
    },
    { flush: 'sync' },
  )

  return {
    lockRatio,
    updateDimension,
  }
}
