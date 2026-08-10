import type { RegisterFunction } from '..'
import BorderBox from './BorderBox.vue'
import { borderBoxMaterialSchema } from './schema'

export function install(register: RegisterFunction) {
  register(borderBoxMaterialSchema, BorderBox)
}
