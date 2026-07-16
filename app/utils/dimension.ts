export type RatioDimension = 'width' | 'height'

export interface DimensionTarget {
  width: number
  height: number
}

export function getDimensionChanges(
  target: DimensionTarget,
  dimension: RatioDimension,
  value: number,
  lockRatio: boolean,
) {
  const nextValue = Number(value)

  if (!Number.isFinite(nextValue) || target[dimension] === nextValue)
    return null

  const aspectRatio = target.width / target.height
  const changes: Partial<DimensionTarget> = { [dimension]: nextValue }

  if (!lockRatio || !Number.isFinite(aspectRatio) || aspectRatio <= 0)
    return changes

  const pairedDimension = dimension === 'width' ? 'height' : 'width'
  const pairedValue = Math.round(
    dimension === 'width' ? nextValue / aspectRatio : nextValue * aspectRatio,
  )

  if (target[pairedDimension] !== pairedValue)
    changes[pairedDimension] = pairedValue

  return changes
}
