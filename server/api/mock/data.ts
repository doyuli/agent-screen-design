const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月']

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default defineEventHandler(() => {
  return {
    list: MONTHS.map((label, index) => ({
      label,
      value: randomInt(100, 1000),
      date: `2026-${String(index + 1).padStart(2, '0')}-01`,
    })),
  }
})
