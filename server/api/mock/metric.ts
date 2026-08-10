export default defineEventHandler(() => {
  return ok({
    value: randomInt(1000, 10000),
    trend: randomInt(-20, 20),
  })
})
