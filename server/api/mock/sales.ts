const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// GET { count: number }
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const count = clamp(Number(query.count) || 12, 1, 24)

  const list = Array.from({ length: count }, (_, i) => ({
    month: MONTHS[i % MONTHS.length],
    sales: randomInt(80, 320),
    target: randomInt(150, 300),
  }))

  return ok({ list })
})
