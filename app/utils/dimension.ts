export type RatioDimension = 'width' | 'height'

export interface DimensionTarget {
  width: number
  height: number
}

export function updateDimension(
  target: DimensionTarget,
  dimension: RatioDimension,
  value: number,
  lockRatio: boolean,
) {
  const nextValue = Number(value)

  if (!Number.isFinite(nextValue))
    return

  const aspectRatio = target.width / target.height
  target[dimension] = nextValue

  if (!lockRatio || !Number.isFinite(aspectRatio) || aspectRatio <= 0)
    return

  const pairedDimension = dimension === 'width' ? 'height' : 'width'
  target[pairedDimension] = Math.round(
    dimension === 'width' ? nextValue / aspectRatio : nextValue * aspectRatio,
  )
}
