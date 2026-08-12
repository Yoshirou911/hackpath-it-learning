import questionsA from './stack/questions_a.json' with { type: 'json' }
import questionsB from './stack/questions_b.json' with { type: 'json' }
import computerBasics from './stack/notes/01_computer_basics.json' with { type: 'json' }
import programming from './stack/notes/02_programming.json' with { type: 'json' }
import algorithms from './stack/notes/03_algorithms.json' with { type: 'json' }
import network from './stack/notes/04_network.json' with { type: 'json' }
import database from './stack/notes/05_database.json' with { type: 'json' }
import security from './stack/notes/06_security.json' with { type: 'json' }
import web from './stack/notes/07_web.json' with { type: 'json' }
import infra from './stack/notes/08_infra.json' with { type: 'json' }
import engineering from './stack/notes/09_engineering.json' with { type: 'json' }
import management from './stack/notes/10_management.json' with { type: 'json' }
import advancedDev from './stack/notes/11_advanced_dev.json' with { type: 'json' }
import advancedSystems from './stack/notes/12_advanced_systems.json' with { type: 'json' }

const noteGroups = [
  computerBasics, programming, algorithms, network, database, security,
  web, infra, engineering, management, advancedDev, advancedSystems,
]

// 原本の「コンピュータ基礎 → 開発 → インフラ → 応用設計」という順序を維持する。
const notes = noteGroups.flat()

export const stackTopic = {
  id: 'stack',
  title: 'IT総合教本・科目A/B',
  subtitle: '詳しい教本と弱点優先トレーニング',
  icon: '🧭',
  level: 'beginner',
  status: 'available',
  category: 'skill',
  path: '/study/stack',
  color: '#7dd3fc',
  lessons: notes.length,
  description: 'コンピュータ基礎から設計・運用まで83教本。科目A四択と科目Bコードトレースに対応',
}

export const stackModule = {
  id: 'stack',
  title: stackTopic.title,
  icon: stackTopic.icon,
  color: stackTopic.color,
  lessons: notes.map((note, index) => ({
    id: `stack-l${index + 1}`,
    title: `${note.category}｜${note.title}`,
    content: `
      <p class="lesson-lead">${escapeHtml(note.title)}を、用語の意味だけでなく仕組み・使いどころ・具体例まで順に学びます。</p>
      <div class="stack-lesson-meta">
        <span>${escapeHtml(note.level)}</span><span>${escapeHtml(note.category)}</span><span>DETAILED TEXTBOOK</span>
      </div>
      <div class="stack-textbook-content">${markdownToHtml(note.body)}</div>
    `,
  })),
}

export const stackQuestions = [
  ...questionsA.map((question, index) => ({
    id: `stack-a-${index + 1}`,
    topic: 'stack',
    category: question.category,
    level: difficultyToLevel(question.difficulty),
    difficulty: question.difficulty,
    question: question.body,
    choices: question.choices.map((choice) => choice.text),
    answer: question.choices.findIndex((choice) => choice.is_correct),
    explanation: question.explanation,
    subject: '科目A',
  })),
  ...questionsB.map((question, index) => ({
    id: `stack-b-${index + 1}`,
    topic: 'stack',
    category: question.category,
    level: difficultyToLevel(question.difficulty),
    difficulty: question.difficulty,
    question: question.body,
    pseudocode: question.pseudocode,
    inputType: 'text',
    expectedAnswer: question.expected_answer,
    explanation: question.explanation,
    subject: '科目B',
  })),
]

export const stackGlossary = []

function difficultyToLevel(difficulty) {
  if (difficulty <= 2) return 'beginner'
  if (difficulty <= 4) return 'intermediate'
  return 'advanced'
}

function markdownToHtml(markdown) {
  const lines = String(markdown).replace(/\r/g, '').split('\n')
  const output = []
  let listType = null
  let inCode = false
  let codeLines = []

  const closeList = () => {
    if (listType) output.push(`</${listType}>`)
    listType = null
  }

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index]
    const line = raw.trim()

    if (line.startsWith('```')) {
      closeList()
      if (inCode) {
        output.push(`<pre class="code-block"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
        codeLines = []
      }
      inCode = !inCode
      continue
    }
    if (inCode) {
      codeLines.push(raw)
      continue
    }
    if (!line) {
      closeList()
      continue
    }
    if (line.startsWith('|') && lines[index + 1]?.trim().match(/^\|[\s:|-]+\|$/)) {
      closeList()
      const headers = splitTableRow(line)
      const rows = []
      index += 2
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[index]))
        index += 1
      }
      index -= 1
      output.push(`<div class="table-wrapper"><table class="note-table"><thead><tr>${headers.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)
      continue
    }
    const unordered = line.match(/^[-*]\s+(.+)/)
    const ordered = line.match(/^\d+\.\s+(.+)/)
    if (unordered || ordered) {
      const nextType = ordered ? 'ol' : 'ul'
      if (listType !== nextType) {
        closeList()
        listType = nextType
        output.push(`<${listType}>`)
      }
      output.push(`<li>${inline((ordered || unordered)[1])}</li>`)
      continue
    }
    closeList()
    if (line.startsWith('### ')) output.push(`<h4>${inline(line.slice(4))}</h4>`)
    else if (line.startsWith('## ')) output.push(`<h3>${inline(line.slice(3))}</h3>`)
    else if (line.startsWith('# ')) output.push(`<h2>${inline(line.slice(2))}</h2>`)
    else output.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  if (inCode && codeLines.length) output.push(`<pre class="code-block"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
  return output.join('')
}

function splitTableRow(line) {
  return line.slice(1, -1).split('|').map((cell) => cell.trim())
}

function inline(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
