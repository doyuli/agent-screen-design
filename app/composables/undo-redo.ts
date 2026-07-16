import { computed, shallowReactive } from 'vue'
import { getValue, setValue } from '~/utils'

type Target = Record<string, unknown>

interface UndoRedoOperation {
  target: Target
  key: string
  newValue: unknown
  oldValue: unknown
}

type UndoRedoBatch = UndoRedoOperation[]

const undoStack = shallowReactive<UndoRedoBatch[]>([])
const redoStack = shallowReactive<UndoRedoBatch[]>([])

const MAX_UNDO_REDO_STACK_SIZE = 1000

let activeBatch: UndoRedoBatch | null = null

export function useUndoRedo() {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)

  function pushUndoBatch(batch: UndoRedoBatch) {
    if (undoStack.length >= MAX_UNDO_REDO_STACK_SIZE) {
      undoStack.shift()
    }
    undoStack.push(batch)
  }

  function startBatch() {
    activeBatch = []
  }

  function commitBatch() {
    if (activeBatch?.length)
      pushUndoBatch(activeBatch)

    activeBatch = null
  }

  function applyChange(target: Target, key: string, value: unknown) {
    const oldValue = getValue(target, key)

    if (oldValue === value)
      return

    const operation = {
      target,
      key,
      newValue: value,
      oldValue,
    }

    if (activeBatch) {
      const current = activeBatch.find(op => op.target === target && op.key === key)
      if (current) {
        current.newValue = value
      }
      else {
        activeBatch.push(operation)
      }
    }
    else {
      pushUndoBatch([operation])
    }

    setValue(target, key, value)
    redoStack.length = 0
  }

  function undo() {
    const batch = undoStack.pop()
    if (!batch)
      return

    for (const op of batch.toReversed()) {
      setValue(op.target, op.key, op.oldValue)
    }

    redoStack.push(batch)
  }

  function redo() {
    const batch = redoStack.pop()
    if (!batch)
      return

    for (const op of batch) {
      setValue(op.target, op.key, op.newValue)
    }

    pushUndoBatch(batch)
  }

  return {
    canRedo,
    canUndo,
    startBatch,
    commitBatch,
    applyChange,
    undo,
    redo,
  }
}
