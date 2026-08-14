export const feMockSpecs = {
  'mock-a': {
    label: '科目A 模擬試験',
    questions: 60,
    minutes: 90,
    note: '全60問。1問あたり約90秒を目安に解きます。',
    ids: Array.from({ length: 60 }, (_, index) => `fe-a-${String(index + 1).padStart(3, '0')}`),
  },
  'mock-b-1': {
    label: '科目B 模擬試験 1',
    questions: 20,
    minutes: 100,
    note: 'アルゴリズム・プログラミング16問＋情報セキュリティ4問。',
    ids: [
      ...Array.from({ length: 16 }, (_, index) => `fe-b-${String(index + 1).padStart(3, '0')}`),
      'fe-b-017', 'fe-b-018', 'fe-b-035', 'fe-b-036',
    ],
  },
  'mock-b-2': {
    label: '科目B 模擬試験 2',
    questions: 20,
    minutes: 100,
    note: '別問題でアルゴリズム・プログラミング16問＋情報セキュリティ4問。',
    ids: [
      'fe-b-019', 'fe-b-020',
      ...Array.from({ length: 14 }, (_, index) => `fe-b-${String(index + 21).padStart(3, '0')}`),
      'fe-b-037', 'fe-b-038', 'fe-b-039', 'fe-b-040',
    ],
  },
}

export function getFeMockSpec(mode) {
  return feMockSpecs[mode] || null
}

export function getFeMockQuestions(base, mode) {
  const spec = getFeMockSpec(mode)
  if (!spec) return null
  const byId = new Map(base.map((question) => [question.id, question]))
  return spec.ids.map((id) => byId.get(id)).filter(Boolean)
}
