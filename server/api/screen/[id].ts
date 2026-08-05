import { loadScreen } from '~~/server/utils/screen-storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Screen id is required',
    })
  }

  const screen = await loadScreen(id)

  if (!screen) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Screen not found',
    })
  }

  return screen
})
