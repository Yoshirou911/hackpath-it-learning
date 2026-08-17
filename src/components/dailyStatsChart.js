// 日別成績グラフ。保存済みの`state.daily`だけを読み取り、新しい保存項目は追加しない。

export const DAILY_RANGE_OPTIONS = [
  { days: 7, label: '7日' },
  { days: 14, label: '14日' },
  { days: 30, label: '30日' },
]

const DEFAULT_RANGE = 14
const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function pad(value) {
  return String(value).padStart(2, '0')
}

function toKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// 活動がない日も0で埋め、日付の間隔が一定のグラフにする。
export function buildDailySeries(daily = {}, days = DEFAULT_RANGE, today = new Date()) {
  const span = Math.max(1, Math.floor(days))
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const series = []
  for (let offset = span - 1; offset >= 0; offset -= 1) {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() - offset)
    const key = toKey(date)
    const entry = daily[key] || {}
    const answered = Math.max(0, Number(entry.answered) || 0)
    const correct = Math.min(answered, Math.max(0, Number(entry.correct) || 0))
    series.push({
      key,
      date,
      answered,
      correct,
      incorrect: answered - correct,
      lessons: Math.max(0, Number(entry.lessons) || 0),
      xp: Math.max(0, Number(entry.xp) || 0),
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      weekday: WEEKDAY_LABELS[date.getDay()],
      isToday: offset === 0,
    })
  }
  return series
}

export function summarizeDailySeries(series) {
  const answered = series.reduce((sum, day) => sum + day.answered, 0)
  const correct = series.reduce((sum, day) => sum + day.correct, 0)
  const lessons = series.reduce((sum, day) => sum + day.lessons, 0)
  const xp = series.reduce((sum, day) => sum + day.xp, 0)
  const activeDays = series.filter((day) => day.answered > 0 || day.lessons > 0).length
  const best = series.reduce((top, day) => (day.answered > (top?.answered || 0) ? day : top), null)
  return {
    answered,
    correct,
    lessons,
    xp,
    activeDays,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    streak: getStudyStreak(series),
    best: best && best.answered > 0 ? best : null,
    maxAnswered: series.reduce((max, day) => Math.max(max, day.answered), 0),
  }
}

// 当日は未学習でも連続記録を切らさず、前日までの連続日数を数える。
function getStudyStreak(series) {
  let streak = 0
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const day = series[index]
    const active = day.answered > 0 || day.lessons > 0
    if (active) {
      streak += 1
    } else if (!day.isToday) {
      break
    }
  }
  return streak
}

export function renderDailyStatsChart(daily = {}, range = DEFAULT_RANGE, today = new Date()) {
  const series = buildDailySeries(daily, range, today)
  const summary = summarizeDailySeries(series)
  const scale = Math.max(1, summary.maxAnswered)
  const hasActivity = summary.answered > 0 || summary.lessons > 0

  const columns = series.map((day) => {
    const height = day.answered > 0 ? Math.max(6, Math.round((day.answered / scale) * 100)) : 0
    const correctShare = day.answered > 0 ? Math.round((day.correct / day.answered) * 100) : 0
    const caption = day.answered > 0
      ? `${day.label} 回答${day.answered}問 正解${day.correct}問 正答率${day.accuracy}%`
      : `${day.label} 学習なし`
    return `
      <div class="daily-chart-column ${day.isToday ? 'is-today' : ''} ${day.answered > 0 ? 'is-active' : ''}" title="${caption}">
        <span class="daily-chart-value">${day.answered > 0 ? day.answered : ''}</span>
        <div class="daily-chart-track">
          <div class="daily-chart-bar" style="height: ${height}%">
            <span class="daily-chart-bar-correct" style="height: ${correctShare}%"></span>
          </div>
        </div>
        <span class="daily-chart-lesson ${day.lessons > 0 ? 'is-on' : ''}" aria-hidden="true"></span>
        <span class="daily-chart-label">${day.label}<small>${day.weekday}</small></span>
      </div>
    `
  }).join('')

  return `
    <section class="glass-card daily-stats-card" data-daily-stats>
      <div class="daily-stats-head">
        <div>
          <span class="eyebrow">DAILY TREND</span>
          <h2>日別の学習推移</h2>
          <p class="daily-stats-note">回答した問題数と正答率を日ごとに集計しています。</p>
        </div>
        <div class="daily-range-switch" role="group" aria-label="集計期間">
          ${DAILY_RANGE_OPTIONS.map((option) => `
            <button type="button" class="daily-range-btn ${option.days === range ? 'is-active' : ''}"
              data-daily-range="${option.days}" aria-pressed="${option.days === range}">${option.label}</button>
          `).join('')}
        </div>
      </div>

      <div class="daily-stats-tiles">
        <div class="daily-stat-tile"><span>学習した日</span><strong>${summary.activeDays}<small>/${series.length}日</small></strong></div>
        <div class="daily-stat-tile"><span>回答数</span><strong>${summary.answered}<small>問</small></strong></div>
        <div class="daily-stat-tile"><span>正答率</span><strong>${summary.accuracy}<small>%</small></strong></div>
        <div class="daily-stat-tile"><span>連続学習</span><strong>${summary.streak}<small>日</small></strong></div>
        <div class="daily-stat-tile"><span>獲得XP</span><strong>${summary.xp}<small>XP</small></strong></div>
      </div>

      ${hasActivity ? `
        <div class="daily-chart ${series.length > 14 ? 'is-dense' : ''}" role="img" aria-label="直近${series.length}日の学習推移。合計${summary.answered}問回答、正答率${summary.accuracy}%、学習した日は${summary.activeDays}日。">
          ${columns}
        </div>
        <p class="daily-chart-axis"><span>${series[0].label}</span><span>${series[series.length - 1].label}</span></p>
        <div class="daily-chart-legend">
          <span><i class="legend-swatch legend-correct"></i>正解</span>
          <span><i class="legend-swatch legend-incorrect"></i>不正解</span>
          <span><i class="legend-swatch legend-lesson"></i>レッスン完了あり</span>
        </div>
        ${summary.best ? `<p class="daily-stats-best">最も回答した日は ${summary.best.label}（${summary.best.answered}問・正答率${summary.best.accuracy}%）です。</p>` : ''}
        <details class="daily-stats-table">
          <summary>数値で確認する</summary>
          <table>
            <thead><tr><th>日付</th><th>回答</th><th>正解</th><th>正答率</th><th>レッスン</th><th>XP</th></tr></thead>
            <tbody>
              ${series.filter((day) => day.answered > 0 || day.lessons > 0).reverse().map((day) => `
                <tr><td>${day.label}(${day.weekday})</td><td>${day.answered}</td><td>${day.correct}</td><td>${day.accuracy}%</td><td>${day.lessons}</td><td>${day.xp}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </details>
      ` : `
        <p class="daily-stats-empty">この期間はまだ記録がありません。問題に回答すると、ここに日別の推移が表示されます。</p>
      `}
    </section>
  `
}
