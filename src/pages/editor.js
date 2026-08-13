import { getCustomLessons, saveCustomLesson, deleteCustomLesson } from '../store.js'
import { roadmapTopics } from '../data/topics.js'

// 全トピック一覧（ドロップダウン用）
export const editorTopics = [
  ...roadmapTopics
    .filter((topic) => topic.status === 'available')
    .map((topic) => ({ id: topic.id, label: topic.title, icon: topic.icon })),
  { id: 'custom',     label: 'その他・カスタム',    icon: '📝' },
]

// 現在編集中のレッスンデータ
let editingId = null

export function renderEditor(path, params) {
  const lessons = getCustomLessons()
  const editTarget = editingId ? lessons.find(l => l.id === editingId) : null

  return `
    <div class="page-header">
      <h1>📝 ノート・コンテンツ追加</h1>
      <p class="page-subtitle">ネットで学んだこと・メモをHackPathに取り込もう</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">

      <!-- 左：入力フォーム -->
      <div class="glass-card" style="padding: 24px;">
        <h2 style="font-size:16px; font-weight:700; margin:0 0 20px; color: var(--accent);">
          ${editTarget ? '✏️ レッスンを編集' : '＋ 新しいレッスンを追加'}
        </h2>

        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="font-size:12px; opacity:0.7; display:block; margin-bottom:6px;">📂 コース・カテゴリ</label>
            <select id="editor-topic" style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-h); font-size:14px;">
              ${editorTopics.map(t => `
                <option value="${t.id}" ${(editTarget?.topicId || 'custom') === t.id ? 'selected' : ''}>
                  ${t.icon} ${t.label}
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="font-size:12px; opacity:0.7; display:block; margin-bottom:6px;">📌 タイトル</label>
            <input id="editor-title" type="text" placeholder="例: TCPとUDPの違いをわかりやすく"
              value="${editTarget ? escapeHtml(editTarget.title) : ''}"
              style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-h); font-size:14px; box-sizing:border-box;" />
          </div>

          <div>
            <label style="font-size:12px; opacity:0.7; display:block; margin-bottom:6px;">
              📄 内容 <span style="opacity:0.5">（テキスト・マークダウン対応）</span>
            </label>
            <textarea id="editor-content" rows="14" placeholder="ネットで学んだ内容や自分のメモを入力できます。

例：
# TCPとは
確実にデータを届ける通信プロトコル。

- 順序を保証する
- 再送制御あり

**太字** や \`コード\` も書けます"
              style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-h); font-size:13px; font-family:monospace; line-height:1.6; box-sizing:border-box; resize:vertical;">${editTarget ? escapeHtml(editTarget.content) : ''}</textarea>
          </div>

          <div>
            <label style="font-size:12px; opacity:0.7; display:block; margin-bottom:6px;">🏷️ タグ <span style="opacity:0.5">（任意・スペース区切り）</span></label>
            <input id="editor-tags" type="text" placeholder="例: ネットワーク 試験対策 重要"
              value="${editTarget ? escapeHtml(editTarget.tags || '') : ''}"
              style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-h); font-size:14px; box-sizing:border-box;" />
          </div>

          <div style="display:flex; gap:10px;">
            <button id="editor-save" class="btn btn-primary" style="flex:1;">
              ${editTarget ? '✅ 更新する' : '💾 保存する'}
            </button>
            ${editTarget ? `<button id="editor-cancel" class="btn btn-secondary">キャンセル</button>` : ''}
            <button id="editor-preview" class="btn btn-secondary">👁️ プレビュー</button>
          </div>
        </div>

        <!-- プレビュー -->
        <div id="editor-preview-area" style="display:none; margin-top:20px; border-top:1px solid var(--border); padding-top:16px;">
          <p style="font-size:12px; opacity:0.6; margin-bottom:8px;">── プレビュー ──</p>
          <div id="editor-preview-content" class="lesson-content-body"></div>
        </div>
      </div>

      <!-- 右：保存済みレッスン一覧 -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <h2 style="font-size:15px; font-weight:700; margin:0;">📚 保存済みノート (${lessons.length}件)</h2>
        </div>

        ${lessons.length === 0 ? `
          <div class="glass-card" style="text-align:center; padding:40px; opacity:0.6;">
            <div style="font-size:40px; margin-bottom:12px;">📭</div>
            <p>まだノートがありません。<br>左のフォームから追加してみよう！</p>
          </div>
        ` : lessons.slice().reverse().map(lesson => {
          const topic = ALL_TOPICS.find(t => t.id === lesson.topicId) || { icon: '📝', label: 'カスタム' }
          const date = new Date(lesson.updatedAt || lesson.createdAt).toLocaleDateString('ja-JP')
          const preview = plainText(lesson.content).slice(0, 80)
          return `
            <div class="glass-card" style="margin-bottom:12px; padding:16px;">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px;">
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                    <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:rgba(108,71,255,0.15); color:var(--accent-2); white-space:nowrap;">
                      ${topic.icon} ${topic.label}
                    </span>
                    <span style="font-size:11px; opacity:0.4;">${date}</span>
                  </div>
                  <h3 style="font-size:14px; font-weight:600; margin:0 0 4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(lesson.title)}</h3>
                  <p style="font-size:12px; opacity:0.6; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(preview)}${preview.length >= 80 ? '...' : ''}</p>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  <a href="#/study/${lesson.topicId === 'custom' ? 'itp' : lesson.topicId}/${lesson.id}"
                     class="btn btn-secondary"
                     style="font-size:12px; padding:6px 10px;"
                     data-nav="/study/${lesson.topicId === 'custom' ? 'itp' : lesson.topicId}/${lesson.id}">読む</a>
                  <button class="btn btn-secondary editor-edit-btn"
                    data-id="${lesson.id}"
                    style="font-size:12px; padding:6px 10px;">編集</button>
                  <button class="btn btn-danger editor-delete-btn"
                    data-id="${lesson.id}" data-title="${escapeHtml(lesson.title)}"
                    style="font-size:12px; padding:6px 10px; background:rgba(255,68,102,0.15); border-color:rgba(255,68,102,0.3); color:#ff4466;">削除</button>
                </div>
              </div>
            </div>
          `
        }).join('')}
      </div>

    </div>

    <div class="glass-card" style="margin-top:24px; padding:16px 20px; background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.2);">
      <p style="font-weight:600; margin:0 0 6px; font-size:14px;">💡 使い方のコツ</p>
      <ul style="font-size:13px; opacity:0.75; margin:0; padding-left:20px; line-height:2;">
        <li><strong>Qiita・Zenn・MDN等</strong>からテキストをコピペしてそのまま保存できます</li>
        <li><strong>マークダウン</strong>の見出し・リスト・太字・コードを自動変換します</li>
        <li>安全のため、貼り付けたHTMLタグは文字として表示します</li>
        <li>保存したノートは <strong>コースのレッスン一覧</strong> に追加されて読めます</li>
      </ul>
    </div>
  `
}

export function bindEditorEvents(container) {
  // プレビューボタン
  const previewBtn = container.querySelector('#editor-preview')
  const previewArea = container.querySelector('#editor-preview-area')
  const previewContent = container.querySelector('#editor-preview-content')
  if (previewBtn && previewArea && previewContent) {
    previewBtn.addEventListener('click', () => {
      const raw = container.querySelector('#editor-content')?.value || ''
      previewContent.innerHTML = renderContent(raw)
      previewArea.style.display = previewArea.style.display === 'none' ? 'block' : 'none'
    })
  }

  // 保存ボタン
  const saveBtn = container.querySelector('#editor-save')
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const topicId = container.querySelector('#editor-topic')?.value || 'custom'
      const title   = container.querySelector('#editor-title')?.value?.trim() || ''
      const content = container.querySelector('#editor-content')?.value?.trim() || ''
      const tags    = container.querySelector('#editor-tags')?.value?.trim() || ''

      if (!title) { alert('タイトルを入力してください'); return }
      if (!content) { alert('内容を入力してください'); return }

      saveCustomLesson({ id: editingId || null, topicId, title, content, tags })
      editingId = null
      rerenderEditor(container)
    })
  }

  // キャンセルボタン
  const cancelBtn = container.querySelector('#editor-cancel')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      editingId = null
      rerenderEditor(container)
    })
  }

  // 編集ボタン
  container.querySelectorAll('.editor-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      editingId = btn.dataset.id
      rerenderEditor(container, { focusForm: true })
    })
  })

  // 削除ボタン
  container.querySelectorAll('.editor-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(`「${btn.dataset.title}」を削除しますか？`)) {
        deleteCustomLesson(btn.dataset.id)
        if (editingId === btn.dataset.id) editingId = null
        rerenderEditor(container)
      }
    })
  })
}

function rerenderEditor(container, { focusForm = false } = {}) {
  const pageContent = container.querySelector('.page-content') || container
  pageContent.innerHTML = renderEditor('/editor', [])
  bindEditorEvents(pageContent)
  if (focusForm) {
    const titleInput = pageContent.querySelector('#editor-title')
    titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    titleInput?.focus()
  }
}

// ─── ユーティリティ ───────────────────────────────────────────

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function plainText(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

// テキスト/マークダウンを安全な描画用HTMLに変換
export function renderContent(raw) {
  // ユーザー入力は必ずエスケープしてから限定的なマークダウンだけを変換する。
  return escapeHtml(raw)
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(?!<)(.+)$/gm, (m) => m.trim() ? `<p>${m}</p>` : '')
}
