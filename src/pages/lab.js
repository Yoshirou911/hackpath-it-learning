// 演習ラボ。ブラウザ内のWorkerでJavaScriptを試し、入出力の一致で自動判定する。
// XPは付与しない（XPは問題回答だけで獲得する既存ルールを維持する）。
import { labExercises, labLevelLabels, getLabExercise } from '../data/labExercises.js'
import { getTopicById } from '../data/topics.js'
import {
  getLabDraft,
  saveLabDraft,
  clearLabDraft,
  isLabExerciseCleared,
  markLabExerciseCleared,
  getClearedLabExercises,
} from '../store.js'
import { runLabExercise, summarizeLabResult, LAB_RUN_TIMEOUT_MS } from '../components/labRunner.js'
import { navigate } from '../router.js'

let currentExerciseId = labExercises[0].id

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderLab(path, params = []) {
  const requested = params[0]
  const exercise = getLabExercise(requested) || getLabExercise(currentExerciseId) || labExercises[0]
  currentExerciseId = exercise.id
  const cleared = getClearedLabExercises()
  const code = getLabDraft(exercise.id) ?? exercise.starterCode

  return `
    <div class="page-header">
      <span class="eyebrow">PRACTICE LAB</span>
      <h1>演習ラボ</h1>
      <p class="page-subtitle">JavaScriptを書いて実行し、期待する結果と一致するか自動で確認できます。</p>
    </div>

    <div class="lab-layout">
      <aside class="glass-card lab-exercise-list" aria-label="課題一覧">
        <div class="lab-list-head">
          <span class="eyebrow">EXERCISES</span>
          <small>${Object.keys(cleared).length}/${labExercises.length} クリア</small>
        </div>
        ${labExercises.map((item) => `
          <a class="lab-exercise-link ${item.id === exercise.id ? 'is-active' : ''}" href="#/lab/${item.id}" data-nav="/lab/${item.id}">
            <span class="lab-exercise-state ${cleared[item.id] ? 'is-cleared' : ''}" aria-hidden="true">${cleared[item.id] ? '✓' : '·'}</span>
            <span class="lab-exercise-copy">
              <strong>${escapeHtml(item.title)}</strong>
              <small>${labLevelLabels[item.level] || item.level} · ${item.tags.map(escapeHtml).join(' / ')}</small>
            </span>
          </a>
        `).join('')}
      </aside>

      <section class="lab-workspace" data-lab-workspace data-exercise-id="${exercise.id}">
        <article class="glass-card lab-brief">
          <div class="lab-brief-head">
            <div>
              <span class="course-level-chip level-${exercise.level}">${labLevelLabels[exercise.level] || exercise.level}</span>
              ${isLabExerciseCleared(exercise.id) ? '<span class="lab-cleared-chip">✓ クリア済み</span>' : ''}
              <h2>${escapeHtml(exercise.title)}</h2>
            </div>
            ${exercise.topicId && getTopicById(exercise.topicId)
              ? `<a class="lab-topic-link" href="#${getTopicById(exercise.topicId).path}" data-nav="${getTopicById(exercise.topicId).path}">関連コース: ${escapeHtml(getTopicById(exercise.topicId).title)} ↗</a>`
              : ''}
          </div>
          <p class="lab-brief-lead">${escapeHtml(exercise.brief)}</p>
          <p class="lab-requirement"><strong>課題</strong>${escapeHtml(exercise.requirement)}</p>
          <p class="lab-signature">定義する関数名: <code>${escapeHtml(exercise.functionName)}</code></p>
        </article>

        <article class="glass-card lab-editor-card">
          <div class="lab-editor-head">
            <label for="lab-code">コード（JavaScript）</label>
            <span class="lab-editor-hint">Ctrl + Enter で実行 · Tabで2スペース入力</span>
          </div>
          <textarea id="lab-code" data-lab-code spellcheck="false" autocomplete="off" rows="14">${escapeHtml(code)}</textarea>
          <div class="lab-editor-actions">
            <button type="button" class="btn btn-primary" data-lab-run>実行して判定</button>
            <button type="button" class="btn btn-secondary" data-lab-reset>最初のコードへ戻す</button>
            <span class="lab-save-state" data-lab-save-state role="status"></span>
          </div>
          <p class="lab-sandbox-note">コードは通信機能を無効化したWorker内で実行し、${LAB_RUN_TIMEOUT_MS}ミリ秒で打ち切ります。入力内容は端末内にのみ保存されます。</p>
        </article>

        <article class="glass-card lab-result-card" data-lab-result>
          ${renderResultPlaceholder(exercise)}
        </article>

        <details class="glass-card lab-hints">
          <summary>ヒントを見る（${exercise.hints.length}件）</summary>
          <ol>${exercise.hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join('')}</ol>
        </details>

        <details class="glass-card lab-solution">
          <summary>模範解答を見る</summary>
          <pre><code>${escapeHtml(exercise.solution)}</code></pre>
        </details>
      </section>
    </div>
  `
}

function renderResultPlaceholder(exercise) {
  return `
    <div class="lab-result-head"><span class="eyebrow">TEST CASES</span><h3>判定結果</h3></div>
    <p class="lab-result-empty">「実行して判定」を押すと、${exercise.cases.length}件のテストケースで確認します。</p>
    <ul class="lab-case-preview">
      ${exercise.cases.map((testCase) => `<li><span>${escapeHtml(testCase.label)}</span><code>${escapeHtml(exercise.functionName)}(${escapeHtml(formatArgs(testCase.args))})</code></li>`).join('')}
    </ul>
  `
}

function formatArgs(args) {
  return args.map((value) => JSON.stringify(value)).join(', ')
}

function renderResult(exercise, result) {
  const summary = summarizeLabResult(result)

  if (result.error) {
    return `
      <div class="lab-result-head"><span class="eyebrow">TEST CASES</span><h3>判定結果</h3></div>
      <p class="lab-result-error">${escapeHtml(result.error)}</p>
      ${renderLogs(result.logs)}
    `
  }

  return `
    <div class="lab-result-head">
      <span class="eyebrow">TEST CASES</span>
      <h3>判定結果</h3>
      <span class="lab-result-score ${summary.allPassed ? 'is-pass' : 'is-fail'}">${summary.passed}/${summary.total} 通過</span>
    </div>
    ${summary.allPassed ? '<p class="lab-result-pass">すべてのテストケースを通過しました。クリア済みとして記録しました。</p>' : ''}
    <ul class="lab-case-list">
      ${result.cases.map((testCase) => `
        <li class="lab-case ${testCase.passed ? 'is-pass' : 'is-fail'}">
          <div class="lab-case-top">
            <span class="lab-case-mark" aria-hidden="true">${testCase.passed ? '✓' : '✗'}</span>
            <strong>${escapeHtml(testCase.label)}</strong>
            <code>${escapeHtml(exercise.functionName)}(${escapeHtml(testCase.argsText)})</code>
          </div>
          ${testCase.passed ? '' : `
            <div class="lab-case-detail">
              <span>期待値<code>${escapeHtml(testCase.expectedText)}</code></span>
              ${testCase.error
                ? `<span class="lab-case-error">エラー<code>${escapeHtml(testCase.error)}</code></span>`
                : `<span>実際の結果<code>${escapeHtml(testCase.actualText)}</code></span>`}
            </div>
          `}
        </li>
      `).join('')}
    </ul>
    ${renderLogs(result.logs)}
  `
}

function renderLogs(logs) {
  if (!logs || logs.length === 0) return ''
  return `
    <div class="lab-log">
      <span class="eyebrow">CONSOLE OUTPUT</span>
      <pre>${logs.map((line) => escapeHtml(line)).join('\n')}</pre>
    </div>
  `
}

// クリア直後に一覧と見出しへ反映し、再読込を待たずに達成が分かるようにする。
function markClearedInList(container, exerciseId) {
  const state = container.querySelector(`.lab-exercise-link[data-nav="/lab/${exerciseId}"] .lab-exercise-state`)
  if (state && !state.classList.contains('is-cleared')) {
    state.classList.add('is-cleared')
    state.textContent = '✓'
    const counter = container.querySelector('.lab-list-head small')
    if (counter) counter.textContent = `${container.querySelectorAll('.lab-exercise-state.is-cleared').length}/${labExercises.length} クリア`
  }
  const heading = container.querySelector('.lab-brief-head > div')
  if (heading && !heading.querySelector('.lab-cleared-chip')) {
    const chip = document.createElement('span')
    chip.className = 'lab-cleared-chip'
    chip.textContent = '✓ クリア済み'
    heading.querySelector('h2')?.before(chip)
  }
}

export function bindLabEvents(container) {
  const workspace = container.querySelector('[data-lab-workspace]')
  if (!workspace) return
  const exercise = getLabExercise(workspace.dataset.exerciseId)
  if (!exercise) return

  const editor = workspace.querySelector('[data-lab-code]')
  const resultPanel = workspace.querySelector('[data-lab-result]')
  const runButton = workspace.querySelector('[data-lab-run]')
  const saveState = workspace.querySelector('[data-lab-save-state]')

  let saveTimer = null
  const scheduleSave = () => {
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      saveLabDraft(exercise.id, editor.value)
      if (saveState) saveState.textContent = '端末に保存しました'
    }, 400)
  }

  editor.addEventListener('input', scheduleSave)

  // Tabでフォーカスを移さず、コードのインデントを入力できるようにする。
  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const { selectionStart, selectionEnd, value } = editor
      editor.value = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`
      editor.selectionStart = editor.selectionEnd = selectionStart + 2
      scheduleSave()
      return
    }
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      run()
    }
  })

  async function run() {
    runButton.disabled = true
    runButton.textContent = '実行中…'
    saveLabDraft(exercise.id, editor.value)

    const result = await runLabExercise({
      code: editor.value,
      functionName: exercise.functionName,
      cases: exercise.cases,
    })

    if (summarizeLabResult(result).allPassed) {
      markLabExerciseCleared(exercise.id)
      markClearedInList(container, exercise.id)
    }
    resultPanel.innerHTML = renderResult(exercise, result)
    runButton.disabled = false
    runButton.textContent = '実行して判定'
  }

  runButton.addEventListener('click', run)

  workspace.querySelector('[data-lab-reset]')?.addEventListener('click', () => {
    clearLabDraft(exercise.id)
    editor.value = exercise.starterCode
    resultPanel.innerHTML = renderResultPlaceholder(exercise)
    if (saveState) saveState.textContent = '最初のコードへ戻しました'
    editor.focus()
  })
}

export function openLabExercise(exerciseId) {
  if (!getLabExercise(exerciseId)) return
  navigate(`/lab/${exerciseId}`)
}
