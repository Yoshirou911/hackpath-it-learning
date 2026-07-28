import { glossary } from '../data/glossary.js'

const COURSE_CONTEXT = {
  itp: {
    what: 'ITを仕事や社会の課題と結び付け、技術・経営・運用を横断して判断するための基礎分野です。',
    why: '用語を暗記するだけでなく、誰のどんな課題を解決する考え方なのかを理解すると、実務と試験の両方で使える知識になります。',
  },
  fe: {
    what: 'コンピュータが情報を処理し、プログラムやネットワークとして動く仕組みを技術者の視点で学ぶ分野です。',
    why: '各技術の役割とデータの流れを説明できると、設計・実装・障害調査の土台ができます。',
  },
  ap: {
    what: '個別技術を組み合わせ、組織で安全かつ継続的にシステムを設計・運用するための応用分野です。',
    why: '技術の長所だけでなく、制約・リスク・代替案まで比較することが実務的な判断につながります。',
  },
  sec: {
    what: '情報資産を守るために、脅威が成立する仕組みと、それを予防・検知・復旧する方法を学ぶ分野です。',
    why: '攻撃手順の暗記ではなく「守る対象・脅威・対策・残るリスク」の関係で理解することが重要です。',
  },
  network: {
    what: '離れた機器同士が、決められた規則に従ってデータを正しい相手へ届ける仕組みです。',
    why: '宛先、経路、名前解決、通信規則を分けて考えると、通信できない原因を順番に切り分けられます。',
  },
  linux: {
    what: 'ハードウェア資源を管理し、アプリケーションを安定して動かすLinuxとOSの仕組みです。',
    why: '権限・プロセス・ファイル・ログの関係が分かると、サーバーを安全に運用し障害を調査できます。',
  },
  database: {
    what: 'データを矛盾なく保存し、必要な情報を正確かつ効率的に取り出すための仕組みです。',
    why: '表やSQLだけでなく、整合性・同時実行・検索性能まで理解すると、壊れにくいデータ設計ができます。',
  },
  web: {
    what: 'ブラウザとサーバーがHTTPで情報を交換し、画面やAPIとして機能を提供する仕組みです。',
    why: '要求から応答、表示、状態更新までの流れを追えると、不具合やセキュリティ問題を発見しやすくなります。',
  },
  programming: {
    what: '人が考えた処理手順を、コンピュータが実行できる命令とデータの組み合わせで表現する技術です。',
    why: '構文ではなく、入力・処理・出力と状態の変化を追うことで、別の言語にも応用できる力が身につきます。',
  },
  cloud: {
    what: 'サーバー、保存領域、ネットワークなどのIT資源を、必要に応じてサービスとして利用する仕組みです。',
    why: '自動化や拡張性だけでなく、責任分界・障害・費用を含めて考えると、安全なクラウド運用ができます。',
  },
  ai: {
    what: 'データから規則や特徴を学び、分類・予測・生成などの判断を行うコンピュータ技術です。',
    why: '学習データ、モデル、評価、利用時の限界を分けて理解すると、結果を過信せず適切に活用できます。',
  },
  git: {
    what: 'ソースコードなどの変更履歴を記録し、複数人で安全に開発するための仕組みと開発道具です。',
    why: '変更の目的と差分を小さく記録すると、失敗から戻る、原因を探す、レビューする作業が容易になります。',
  },
  sysdesign: {
    what: '必要な機能と品質を満たすために、システムの部品・責任・データの流れを決める分野です。',
    why: '性能・可用性・安全性・費用のトレードオフを説明できることが、良い設計につながります。',
  },
}

const ALL_DEFINITIONS = Object.values(glossary).flat()
const DEFINITION_BY_TERM = new Map(
  ALL_DEFINITIONS.map((item) => [normalize(item.term), item.definition]),
)

const PURPOSE_RULES = [
  [/暗号|認証|認可|脆弱|攻撃|マルウェア|CIA|ISMS|ファイアウォール|CSP|XSS|CSRF/i,
    '守る対象と想定する脅威を明確にし、事故の予防・検知・影響軽減のどこを担当するか考える概念です。'],
  [/TCP|UDP|HTTP|DNS|IP|LAN|WAN|ルータ|ネットワーク|サブネット|VLAN|ARP|DHCP|TLS/i,
    '通信のどの段階を担当し、入力されたデータを次の相手へどう渡すかを理解することが重要です。'],
  [/SQL|DB|データ|トランザクション|キー|索引|インデックス|正規化|ACID|NoSQL/i,
    'データの意味・整合性・検索方法のどれを担う仕組みかを区別すると、設計上の役割が分かります。'],
  [/アルゴリズム|探索|ソート|キュー|スタック|配列|リスト|ハッシュ|木構造|グラフ|O\(/i,
    '同じ結果を得る方法でも、処理時間とメモリ使用量が変わるため、データ量に合う方法を選ぶために使います。'],
  [/プロセス|メモリ|ファイル|systemd|シェル|権限|ログ|CPU|バス|入出力/i,
    'OSやハードウェアの中で、どの資源を誰が管理し、異常時にどこを確認するかを結び付ける概念です。'],
  [/クラウド|AWS|Docker|コンテナ|Kubernetes|CI\/CD|IaC|サーバレス|監視/i,
    '環境を再現可能にし、変化や障害へ継続的に対応するため、構築・配布・運用のどこを自動化するかが要点です。'],
  [/AI|機械学習|学習|モデル|ニューラル|分類|回帰|クラスタ|生成/i,
    'どのデータから何を学び、未知の入力にどんな結果を返すか、また誤りをどう評価するかが要点です。'],
  [/管理|PDCA|ITIL|要件|RFP|SLA|レビュー|テスト|リスク|設計/i,
    '目的・担当・判断基準・成果物を明確にし、作業を再現可能にして改善するための考え方です。'],
  [/モデル|アーキテクチャ|層|レイヤ|方式|構造/i,
    '複雑な対象を役割ごとに分け、各部分の責任と接続関係を説明しやすくするための見方です。'],
]

export function renderExplainedLesson(content, { topicId, lessonTitle, isCustom = false } = {}) {
  if (isCustom || content.includes('lesson-lead') || content.includes('lesson-understanding-guide')) {
    return content
  }

  const context = COURSE_CONTEXT[topicId] ?? COURSE_CONTEXT.itp
  const explainedItems = content.replace(
    /<li><strong>([^<]+)<\/strong>\s*(?:—|–|-)\s*([^<]+)<\/li>/g,
    (_, rawTerm, rawSummary) => renderConcept(rawTerm.trim(), rawSummary.trim(), lessonTitle, context),
  )

  const listStyled = explainedItems.replace(/<ul>/g, '<ul class="explained-concept-list">')

  return `
    <section class="lesson-understanding-guide">
      <span class="eyebrow">UNDERSTANDING GUIDE</span>
      <h2>まず「${escapeHtml(lessonTitle)}」とは何か</h2>
      <p>${context.what}</p>
      <div class="lesson-guide-reason"><strong>なぜ学ぶ？</strong><p>${context.why}</p></div>
      <p class="lesson-guide-tip">読み方のコツ：名前だけを覚えず、「何を解決するか → どう動くか → 何と使い分けるか」の順で確認しましょう。</p>
    </section>
    ${listStyled}
  `
}

function renderConcept(term, summary, lessonTitle, context) {
  const glossaryDefinition = DEFINITION_BY_TERM.get(normalize(term))
  const definition = glossaryDefinition && glossaryDefinition !== summary
    ? `${glossaryDefinition} このレッスンでは、特に「${summary}」という側面を扱います。`
    : makeDefinition(term, summary)
  const purpose = PURPOSE_RULES.find(([pattern]) => pattern.test(term))?.[1]
    ?? `${context.why}「${lessonTitle}」の中で、この用語がどの役割を担うかに注目してください。`

  return `
    <li class="concept-explanation-card">
      <div class="concept-explanation-heading"><strong>${escapeHtml(term)}</strong><span>KEY CONCEPT</span></div>
      <p><b>これは何？</b>${escapeHtml(definition)}</p>
      <p><b>なぜ必要？</b>${escapeHtml(purpose)}</p>
      <p class="concept-check"><b>理解チェック</b>自分の言葉で「解決する課題」と「似た用語との違い」を説明できれば、丸暗記ではなく理解できています。</p>
    </li>
  `
}

function makeDefinition(term, summary) {
  const ending = /[。！？]$/.test(summary) ? '' : '。'
  return `${term}とは、${summary}${ending}を表す用語・考え方です。名前ではなく、実際の処理や判断の中で何を担当するかを押さえましょう。`
}

function normalize(value) {
  return String(value).toLowerCase().replace(/\s+/g, '').replace(/[・／]/g, '/')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
