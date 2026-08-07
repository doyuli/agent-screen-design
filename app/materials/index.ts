import type { Component } from 'vue'
import type { EventDefinitionSchema, MaterialDefinitionSchema, MaterialGroupSchema, MaterialSchema, MaterialTypeSchema } from '~~/shared/schema/material'

const materials: MaterialDefinitionSchema[] = []
const componentMap = new Map<MaterialTypeSchema, Component>()
const materialMap = new Map<MaterialTypeSchema, MaterialDefinitionSchema>()

export type RegisterFunction = (material: MaterialDefinitionSchema, component: Component) => void

export const register: RegisterFunction = (material, component) => {
  materials.push(material)
  componentMap.set(material.schema.type, component)
  materialMap.set(material.schema.type, material)
}

const materialModules = import.meta.glob('./*/index.ts', { eager: true })

Object.values(materialModules).forEach((m: any) => {
  const module = m ?? m?.default ?? {}
  if (module?.install) {
    module.install(register)
  }
})

const MATERIAL_GROUPS: { key: MaterialGroupSchema, name: string }[] = [
  {
    name: '基础',
    key: 'basics',
  },
  {
    name: '图表',
    key: 'charts',
  },
]

const COMMON_EVENT_DEFINITIONS: EventDefinitionSchema[] = [
  {
    label: '点击',
    value: 'click',
  },
  {
    label: '双击',
    value: 'dblclick',
  },
  {
    label: '组件挂载',
    value: 'vnodeMounted',
  },
  {
    label: '组件卸载',
    value: 'vnodeUnmounted',
  },
]

export function getAllMaterials() {
  return [...materials]
}

export function getMaterialsByGroup(group: MaterialGroupSchema) {
  return materials.filter(material => material.group === group)
}

export function getMaterialGroups() {
  return MATERIAL_GROUPS
}

export function getMaterialComponent(type: MaterialTypeSchema) {
  return componentMap.get(type)
}

export function getMaterialFields(type: MaterialTypeSchema) {
  return materialMap.get(type)?.fields || []
}

export function createMaterialNode(node: MaterialDefinitionSchema['schema']): MaterialSchema {
  return {
    ...node,
    id: crypto.randomUUID(),
  }
}

export function getMaterialEvents(type: MaterialTypeSchema) {
  const events = materialMap.get(type)?.events || []
  return [
    ...COMMON_EVENT_DEFINITIONS,
    ...events,
  ]
}
