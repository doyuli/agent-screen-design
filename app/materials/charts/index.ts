import type { RegisterFunction } from '..'
import Chat from './Chat.vue'
import { areaChartMaterialSchema, barChartMaterialSchema, lineChartMaterialSchema, pieChartMaterialSchema } from './schema'

const chartsMaterialSchemas = [
  areaChartMaterialSchema,
  barChartMaterialSchema,
  lineChartMaterialSchema,
  pieChartMaterialSchema,
]

export function install(register: RegisterFunction) {
  chartsMaterialSchemas.forEach((material) => {
    register(material, Chat)
  })
}
