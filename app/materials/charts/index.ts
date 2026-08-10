import type { RegisterFunction } from '..'
import Chart from './Chart.vue'
import {
  areaChartMaterialSchema,
  barChartMaterialSchema,
  donutChartMaterialSchema,
  gaugeChartMaterialSchema,
  horizontalBarChartMaterialSchema,
  lineChartMaterialSchema,
  pieChartMaterialSchema,
  roseChartMaterialSchema,
} from './schema'

const chartsMaterialSchemas = [
  areaChartMaterialSchema,
  barChartMaterialSchema,
  lineChartMaterialSchema,
  pieChartMaterialSchema,
  gaugeChartMaterialSchema,
  donutChartMaterialSchema,
  roseChartMaterialSchema,
  horizontalBarChartMaterialSchema,
]

export function install(register: RegisterFunction) {
  chartsMaterialSchemas.forEach((material) => {
    register(material, Chart)
  })
}
