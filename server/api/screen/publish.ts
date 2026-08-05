import { saveScreen } from '~~/server/utils/screen-storage'
import { pageSchema } from '~~/shared/schema/page'

export default defineEventHandler(async (event) => {
  const result = pageSchema.safeParse(await readBody(event))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid page schema',
      data: result.error.flatten(),
    })
  }

  return saveScreen(result.data)
})
