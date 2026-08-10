import type { RegisterFunction } from '..'
import MetricCard from './MetricCard.vue'
import { metricCardMaterialSchema } from './schema'

export function install(register: RegisterFunction) {
  register(metricCardMaterialSchema, MetricCard)
}
