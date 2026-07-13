import type { Component } from 'vue'
import { z } from 'zod'

export const layoutSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

export const materialTypeSchema = z.enum([
  'text',
  'charts',
])

export const materialGroupSchema = z.enum([
  'basics',
  'charts',
])

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: materialTypeSchema,
  layout: layoutSchema,
  style: z.record(z.string(), z.unknown()).optional(),
  props: z.record(z.string(), z.unknown()),
})

export const materialDefinitionSchema = z.object({
  name: z.string(),
  group: materialGroupSchema,
  icon: z.custom<Component>(),
  schema: materialSchema.omit({ id: true }),
})

export type MaterialType = z.infer<typeof materialTypeSchema>

export type MaterialGroup = z.infer<typeof materialGroupSchema>

export type Material = z.infer<typeof materialSchema>

export type MaterialDefinition = z.infer<typeof materialDefinitionSchema>
