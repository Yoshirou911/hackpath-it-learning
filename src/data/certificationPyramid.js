// HackPath内での学習順を示す独自の難易度目安。公式な資格序列ではない。
// 上から頂点、下へ行くほど基礎となるように並べる。
export const certificationPyramidTiers = [
  {
    rankId: 'sovereign',
    label: '最高峰・防御設計',
    description: '複雑な脅威と組織全体の防御を統合する',
    topicIds: ['sc'],
  },
  {
    rankId: 'master',
    label: '経営・統率',
    description: 'IT戦略と大規模プロジェクトを率いる',
    topicIds: ['st', 'pmcert'],
  },
  {
    rankId: 'diamond',
    label: '高度専門',
    description: 'ネットワークとデータ基盤を深く設計する',
    topicIds: ['nwsp', 'dbsp'],
  },
  {
    rankId: 'platinum',
    label: '実務統合',
    description: '複数領域をつなぎ、現場の判断へ変える',
    topicIds: ['ap', 'sec'],
  },
  {
    rankId: 'gold',
    label: '技術実践',
    description: 'IT基礎を使って構築・運用できる状態へ進む',
    topicIds: ['fe', 'ccna', 'linuc1'],
  },
  {
    rankId: 'silver',
    label: '業務基礎',
    description: 'クラウドとセキュリティを業務視点で理解する',
    topicIds: ['sg', 'awsclf'],
  },
  {
    rankId: 'bronze',
    label: '共通知識の土台',
    description: 'IT全体の言葉と仕組みを広くつかむ',
    topicIds: ['itp'],
  },
]

