// 公式区分を基礎資料にし、HackPathの共通ルーブリックで比較した独自推定。
// 合格率や学習時間は年度・受験者経験で変動するため採点には含めない。
export const certificationDifficultyRubric = [
  { id: 'depth', label: '知識の深さ', max: 30 },
  { id: 'breadth', label: '出題範囲', max: 20 },
  { id: 'judgement', label: '応用・状況判断', max: 25 },
  { id: 'response', label: '記述・構成負荷', max: 15 },
  { id: 'prerequisite', label: '前提知識', max: 10 },
]

export const certificationDifficultyRanking = [
  {
    topicId: 'sc', score: 96, tier: 'S', officialBand: 'IPA 高度な知識・技能',
    breakdown: { depth: 30, breadth: 18, judgement: 25, response: 13, prerequisite: 10 },
    reason: 'セキュリティの技術深度に加え、設計・運用・インシデント対応を横断して判断する。',
  },
  {
    topicId: 'st', score: 95, tier: 'S', officialBand: 'IPA 高度な知識・技能',
    breakdown: { depth: 29, breadth: 18, judgement: 24, response: 15, prerequisite: 9 },
    reason: '経営課題をIT戦略へ変換し、具体的な経験と判断を一貫した論述にまとめる。',
  },
  {
    topicId: 'pmcert', score: 94, tier: 'S', officialBand: 'IPA 高度な知識・技能',
    breakdown: { depth: 27, breadth: 18, judgement: 24, response: 15, prerequisite: 10 },
    reason: '複雑なプロジェクト状況を分析し、管理判断と結果を論述で説明する。',
  },
  {
    topicId: 'nwsp', score: 93, tier: 'S', officialBand: 'IPA 高度な知識・技能',
    breakdown: { depth: 30, breadth: 16, judgement: 24, response: 13, prerequisite: 10 },
    reason: 'ネットワークの深い専門知識を、構成図・ログ・障害事例へ適用する。',
  },
  {
    topicId: 'dbsp', score: 92, tier: 'S', officialBand: 'IPA 高度な知識・技能',
    breakdown: { depth: 30, breadth: 16, judgement: 23, response: 13, prerequisite: 10 },
    reason: 'データモデル、SQL、トランザクション、性能を一体で設計・分析する。',
  },
  {
    topicId: 'ap', score: 81, tier: 'A', officialBand: 'IPA レベル3・応用的知識技能',
    breakdown: { depth: 24, breadth: 19, judgement: 20, response: 10, prerequisite: 8 },
    reason: '広いIT知識を持ち、事例から技術・管理・戦略の適切な判断を選ぶ。',
  },
  {
    topicId: 'ccna', score: 71, tier: 'B', officialBand: 'Cisco Associate',
    breakdown: { depth: 22, breadth: 15, judgement: 19, response: 7, prerequisite: 8 },
    reason: 'ネットワークの構築・運用知識と、設定や障害切り分けの判断を求める。',
  },
  {
    topicId: 'fe', score: 68, tier: 'B', officialBand: 'IPA レベル2・基本的知識技能',
    breakdown: { depth: 20, breadth: 18, judgement: 17, response: 6, prerequisite: 7 },
    reason: 'IT全般の基礎に加え、アルゴリズムを読み解いて解答する力が必要。',
  },
  {
    topicId: 'linuc1', score: 64, tier: 'B', officialBand: 'LinuC Level 1・2試験',
    breakdown: { depth: 19, breadth: 14, judgement: 17, response: 7, prerequisite: 7 },
    reason: 'Linuxのコマンド、設定、運用を101・102の二つの試験範囲で身につける。',
  },
  {
    topicId: 'sg', score: 54, tier: 'C', officialBand: 'IPA レベル2・基本的知識技能',
    breakdown: { depth: 16, breadth: 15, judgement: 14, response: 4, prerequisite: 5 },
    reason: '組織のセキュリティ運用を中心に、ケースから適切な管理策を判断する。',
  },
  {
    topicId: 'awsclf', score: 44, tier: 'C', officialBand: 'AWS Foundational',
    breakdown: { depth: 13, breadth: 14, judgement: 10, response: 4, prerequisite: 3 },
    reason: 'AWSの主要サービス、セキュリティ、料金を幅広く説明できる入門資格。',
  },
  {
    topicId: 'itp', score: 40, tier: 'C', officialBand: 'IPA 共通的知識',
    breakdown: { depth: 10, breadth: 18, judgement: 7, response: 3, prerequisite: 2 },
    reason: 'IT・経営・管理の用語を広く扱うが、専門的な設計や記述の負荷は小さい。',
  },
]

export const certificationDifficultySources = [
  { label: 'IPA 試験区分一覧', url: 'https://www.ipa.go.jp/shiken/kubun/list.html' },
  { label: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
  { label: 'Cisco CCNA', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html' },
  { label: 'LinuC Level 1', url: 'https://lpi.or.jp/examination/level1.shtml' },
]

