import type { MaterialSchema } from '~~/shared/schema/material'
import type { PageSchema } from '~~/shared/schema/page'
import { setValue } from '~/utils'

type MaterialInstance = Record<string, unknown>

export interface ScreenRuntimeContext {
  getNode: (id: string) => MaterialSchema | undefined
  setAttribute: (id: string, key: string, value: unknown) => void
  setProp: (id: string, key: string, value: unknown) => void
  setStyle: (id: string, key: string, value: unknown) => void
  registerInstance: (id: string, instance: MaterialInstance) => void
  invoke: (id: string, name: string, ...args: unknown[]) => void
  dispatch: (id: string, name: string, payload?: unknown) => void
}

export function createRuntimeContext(schema: Ref<PageSchema>): ScreenRuntimeContext {
  const INSTANCE_MAP = new Map<string, MaterialInstance>()

  const getNode: ScreenRuntimeContext['getNode'] = (id) => {
    const node = schema.value.nodes.find(node => node.id === id)
    if (!node) {
      warn(`Node ${id} not found`)
      return
    }
    return node
  }

  const setAttribute: ScreenRuntimeContext['setAttribute'] = (id, key, value) => {
    const node = getNode(id)
    if (node)
      setValue(node, key, value)
  }

  const setProp: ScreenRuntimeContext['setProp'] = (id, key, value) => {
    setAttribute(id, `props.${key}`, value)
  }

  const setStyle: ScreenRuntimeContext['setStyle'] = (id, key, value) => {
    setAttribute(id, `style.${key}`, value)
  }

  const registerInstance: ScreenRuntimeContext['registerInstance'] = (id, instance) => {
    INSTANCE_MAP.set(id, instance)
  }

  const invoke: ScreenRuntimeContext['invoke'] = (id, name, ...args) => {
    const instance = INSTANCE_MAP.get(id)
    if (instance) {
      if (typeof instance[name] === 'function')
        return instance[name]?.(...args)
    }
  }

  const dispatch: ScreenRuntimeContext['dispatch'] = (id, name, payload) => {
    const node = getNode(id)
    if (node) {
      const event = node.events?.find(event => event.name === name)
      if (event)
        event.handler?.(payload)
    }
  }

  return {
    getNode,
    setAttribute,
    setProp,
    setStyle,
    registerInstance,
    invoke,
    dispatch,
  }
}

function warn(message: string) {
  console.warn(`[Screen Runtime] ${message}`)
}
