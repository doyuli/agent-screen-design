import type { Component } from 'vue'
import type { Material, MaterialDefinition, MaterialGroup, MaterialType } from '~~/shared/schema/material'

const materials: MaterialDefinition[] = []
const componentMap = new Map<MaterialType, Component>()
const materialMap = new Map<MaterialType, MaterialDefinition>()

export type RegisterFunction = (material: MaterialDefinition, component: Component) => void

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

const MATERIAL_GROUPS: { key: MaterialGroup, name: string }[] = [
  {
    name: '基础',
    key: 'basics',
  },
  {
    name: '图表',
    key: 'charts',
  },
]

export function getAllMaterials() {
  return [...materials]
}

export function getMaterialsByGroup(group: MaterialGroup) {
  return materials.filter(material => material.group === group)
}

export function getMaterialGroups() {
  return MATERIAL_GROUPS
}

export function getMaterialComponent(type: MaterialType) {
  return componentMap.get(type)
}

export function createMaterialNode(node: MaterialDefinition['schema']): Material {
  return {
    ...node,
    id: crypto.randomUUID(),
  }
}
