import { skillCourseTopics } from './skillCourses.js'
import { stackTopic } from './stackCourse.js'
import { expandedCertificationTopics } from './certificationExpansion.js'

const certificationTopics = [
  {
    id: 'itp',
    title: 'ITパスポート',
    subtitle: 'ITの基礎を固める第一歩',
    icon: '📘',
    level: 'beginner',
    status: 'available',
    path: '/study/itp',
    color: '#00ff88',
    lessons: 10,
    description: 'ストラテジ・マネジメント・テクノロジの3分野をカバー',
  },
  {
    id: 'fe',
    title: '基本情報技術者',
    subtitle: 'ITエンジニアの登竜門',
    icon: '💻',
    level: 'beginner',
    status: 'available',
    path: '/study/fe',
    color: '#00ccff',
    lessons: 10,
    description: 'アルゴリズム、ネットワーク、DB、OSの基礎',
  },
  {
    id: 'ap',
    title: '応用情報技術者',
    subtitle: '実務レベルのIT知識',
    icon: '🎯',
    level: 'intermediate',
    status: 'available',
    path: '/study/ap',
    color: '#6c47ff',
    lessons: 10,
    description: 'システム開発、プロジェクト管理、セキュリティ概要',
  },
  {
    id: 'sec',
    title: 'セキュリティ & 倫理的ハッキング',
    subtitle: '攻撃と防御の仕組みを理解する',
    icon: '🔒',
    level: 'intermediate',
    status: 'available',
    path: '/security',
    color: '#ff4466',
    lessons: 10,
    description: 'ネットワーク基礎、攻撃手法、CTF入門、ペンテスト',
  },
  {
    id: 'gamedev',
    title: 'ゲーム開発入門',
    subtitle: 'Coming Soon',
    icon: '🎮',
    level: 'beginner',
    status: 'locked',
    path: '/gamedev',
    color: '#888',
    lessons: 0,
    description: '準備中 — ゲームエンジン比較、ロジック解説',
  },
]

// categoryはロードマップ表示と将来のコース検索に使用する。
certificationTopics.forEach((topic) => {
  topic.category ??= topic.id === 'gamedev' ? 'skill' : 'certification'
})

export const roadmapTopics = [...certificationTopics, ...expandedCertificationTopics, ...skillCourseTopics, stackTopic]

export function getTopicById(id) {
  return roadmapTopics.find((t) => t.id === id)
}
