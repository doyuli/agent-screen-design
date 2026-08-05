import type { PageSchema } from '~~/shared/schema/page'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { pageSchema } from '~~/shared/schema/page'

const screensDirectory = join(process.cwd(), '.database', 'screens')

function getScreenPath(id: string) {
  return join(screensDirectory, `${id}.json`)
}

export async function saveScreen(schema: PageSchema) {
  const savedSchema = { ...schema, id: schema.id || randomUUID() }
  const filePath = getScreenPath(savedSchema.id)
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`

  await mkdir(screensDirectory, { recursive: true })
  await writeFile(temporaryPath, `${JSON.stringify(savedSchema, null, 2)}\n`, 'utf8')
  await rename(temporaryPath, filePath)

  return savedSchema
}

export async function loadScreen(id: string) {
  try {
    const content = await readFile(getScreenPath(id), 'utf8')
    const result = pageSchema.safeParse(JSON.parse(content))

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Stored screen schema is invalid',
      })
    }

    return result.data
  }
  catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }

    throw error
  }
}
