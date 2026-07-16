import { useEventListener } from '@vueuse/core'
import { onScopeDispose } from 'vue'

interface Shortcut {
  match: (event: KeyboardEvent) => boolean
  enabled?: () => boolean
  execute: () => void
}

interface ShortcutOptions extends Omit<Shortcut, 'match'> {
  keys: string[]
}

type ModifierKey = 'alt' | 'ctrl' | 'meta' | 'shift'

interface KeyCombination {
  key: string
  modifiers: Set<ModifierKey>
}

const modifierKeys = new Set<ModifierKey>(['alt', 'ctrl', 'meta', 'shift'])

const shortcuts = new Set<Shortcut>()

function isMacOS() {
  return typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent)
}

function parseKeyCombination(keys: string): KeyCombination | undefined {
  const modifiers = new Set<ModifierKey>()
  let key: string | undefined

  const keyParts = keys
    .toLowerCase()
    .split(/[+_-]/)
    .map(key => key.trim())
    .filter(Boolean)

  const isMac = isMacOS()

  for (const keyPart of keyParts) {
    const modifier = keyPart === 'mod' ? (isMac ? 'meta' : 'ctrl') : keyPart

    if (modifierKeys.has(modifier as ModifierKey))
      modifiers.add(modifier as ModifierKey)
    else if (key)
      return
    else
      key = modifier
  }

  return key ? { key, modifiers } : undefined
}

function matchesKeyCombination(combination: KeyCombination, event: KeyboardEvent) {
  return combination.key === event.key.toLowerCase()
    && combination.modifiers.has('alt') === event.altKey
    && combination.modifiers.has('ctrl') === event.ctrlKey
    && combination.modifiers.has('meta') === event.metaKey
    && combination.modifiers.has('shift') === event.shiftKey
}

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || target.matches('input, textarea, select'))
}

export function useKeyboard() {
  function registerShortcut({ keys, ...shortcut }: ShortcutOptions) {
    const combinations = keys.map(parseKeyCombination).filter((key): key is KeyCombination => Boolean(key))
    const registeredShortcut: Shortcut = {
      ...shortcut,
      match: event => combinations.some(key => matchesKeyCombination(key, event)),
    }

    shortcuts.add(registeredShortcut)

    onScopeDispose(() => {
      shortcuts.delete(registeredShortcut)
    })
  }

  useEventListener(
    'keydown',
    (event) => {
      if (event.repeat || isEditableTarget(event.target))
        return

      for (const shortcut of shortcuts) {
        if (!shortcut.match(event))
          continue

        if (shortcut.enabled && !shortcut.enabled())
          continue

        event.preventDefault()
        shortcut.execute()
        break
      }
    },
    {
      passive: false,
    },
  )
  return {
    registerShortcut,
  }
}
