import { z } from 'zod'
import { materialSchema } from './material'

export const canvasSchema = z.object({
  width: z.number(),
  height: z.number(),
  backgroundColor: z.string(),
})

export const pageSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  type: z.literal('page'),
  canvas: canvasSchema,
  nodes: z.array(materialSchema),
})

export type PageSchema = z.infer<typeof pageSchema>
export type CanvasSchema = z.infer<typeof canvasSchema>
