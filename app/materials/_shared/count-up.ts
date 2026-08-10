import type { MaybeRefOrGetter } from 'vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import { computed, onMounted, ref, toValue, watch } from 'vue'

export function useCountUp(
  target: MaybeRefOrGetter<number>,
  duration: MaybeRefOrGetter<number> = 1000,
) {
  const source = ref(0)

  onMounted(() => {
    source.value = toValue(target)
  })

  watch(
    () => toValue(target),
    (value) => {
      source.value = value
    },
  )

  return useTransition(source, {
    duration: computed(() => toValue(duration)),
    transition: TransitionPresets.easeOutExpo,
  })
}

export function formatCountUpValue(
  value: number,
  decimals = 0,
  separator = true,
) {
  const fixed = value.toFixed(Math.max(0, decimals))
  const [intPart, decimalPart] = fixed.split('.')
  const formattedInt = separator ? intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : intPart
  return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt
}
