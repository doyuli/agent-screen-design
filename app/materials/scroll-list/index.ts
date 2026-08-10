import type { RegisterFunction } from '..'
import { scrollListMaterialSchema } from './schema'
import ScrollList from './ScrollList.vue'

export function install(register: RegisterFunction) {
  register(scrollListMaterialSchema, ScrollList)
}
