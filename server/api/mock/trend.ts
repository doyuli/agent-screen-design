// POST { count: number }
export default defineEventHandler(async (event) => {
  const body = await readBody<{ count?: number | string }>(event)
  const count = clamp(Number(body?.count) || 7, 1, 31)

  const list = Array.from({ length: count }, (_, i) => ({
    date: daysAgo(count - 1 - i),
    visits: randomInt(600, 1500),
    orders: randomInt(50, 200),
  }))

  return ok({ list })
})
