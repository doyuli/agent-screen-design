import type { Component } from 'vue'
import { z } from 'zod'

export const layoutSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  lockRatio: z.boolean(),
})

export const materialTypeSchema = z.enum([
  'text',
  'area-chart',
  'bar-chart',
  'line-chart',
  'pie-chart',
])

export const materialGroupSchema = z.enum([
  'basics',
  'charts',
])

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  locked: z.boolean().optional(),
  type: materialTypeSchema,
  layout: layoutSchema,
  style: z.record(z.string(), z.unknown()).optional(),
  props: z.record(z.string(), z.unknown()),
  dataSourceId: z.string().optional(),
})

export const fieldTypeSchema = z.enum([
  'input',
  'number',
  'switch',
  'select',
  'checkbox',
  'color',
  'separator',
])

export const fieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: fieldTypeSchema,
  span: z.number().optional(),
  props: z.record(z.string(), z.unknown()).optional(),
})

export const materialDefinitionSchema = z.object({
  name: z.string(),
  group: materialGroupSchema,
  icon: z.custom<Component>(),
  schema: materialSchema.omit({ id: true }),
  fields: z.array(fieldSchema),
})

export type FieldSchema = z.infer<typeof fieldSchema>

export type FieldTypeSchema = z.infer<typeof fieldTypeSchema>

export type MaterialTypeSchema = z.infer<typeof materialTypeSchema>

export type MaterialGroupSchema = z.infer<typeof materialGroupSchema>

export type MaterialSchema = z.infer<typeof materialSchema>

export type MaterialDefinitionSchema = z.infer<typeof materialDefinitionSchema>
