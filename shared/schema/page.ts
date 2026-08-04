import { z } from 'zod'
import { materialSchema } from './material'

export const canvasSchema = z.object({
  width: z.number(),
  height: z.number(),
  backgroundColor: z.string(),
})

export const dataSourceTypeSchema = z.enum(['api', 'static'])

const baseDataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  data: z.unknown(),
})

export const apiDataSourceSchema = baseDataSourceSchema.extend({
  type: z.literal(dataSourceTypeSchema.enum.api),
  url: z.string(),
  method: z.enum(['GET', 'POST']),
  headers: z.record(z.string(), z.string()).optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  interval: z.number().int().positive().optional().describe('milliseconds'),
  responsePath: z.string().optional(),
})

export const staticDataSourceSchema = baseDataSourceSchema.extend({
  type: z.literal(dataSourceTypeSchema.enum.static),
})

export const dataSourceSchema = z.discriminatedUnion('type', [
  apiDataSourceSchema,
  staticDataSourceSchema,
])

export const pageSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  type: z.literal('page'),
  canvas: canvasSchema,
  nodes: z.array(materialSchema),
  dataSources: z.array(dataSourceSchema),
})

export type PageSchema = z.infer<typeof pageSchema>
export type CanvasSchema = z.infer<typeof canvasSchema>
export type DataSourceTypeSchema = z.infer<typeof dataSourceTypeSchema>
export type DataSourceSchema = z.infer<typeof dataSourceSchema>
export type ApiDataSourceSchema = z.infer<typeof apiDataSourceSchema>
export type StaticDataSourceSchema = z.infer<typeof staticDataSourceSchema>
