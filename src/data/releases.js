export const releaseHistory = [
  {
    version: '1.0.0',
    date: '2026-08-14',
    title: '正式版・学習体験アップデート',
    summary: '30コースを横断して学べる現在のHackPathを、正式版としてバージョン管理へ移行しました。',
    highlights: ['30コース', '369教材', '671問', '481用語'],
    sections: [
      {
        type: 'feature',
        label: '追加',
        items: [
          '現在のバージョンと過去の更新内容を確認できるアップデート画面を追加',
          '基本情報技術者を36教材・120問・100用語へ拡張',
          '資格対策13コースとITスキル17コースを整理して収録',
        ],
      },
      {
        type: 'improvement',
        label: '改善',
        items: [
          '左メニューを資格対策・ITスキル・学習ツールへ整理',
          '問題演習の分野・復習・難易度フィルターをURLへ保存',
          'クイズ選択肢をEnter・Spaceキーでも操作可能に変更',
        ],
      },
      {
        type: 'fix',
        label: '修正',
        items: [
          '問題フィルター操作でメニューと上部バーが消える不具合を修正',
          '効果音ボタンが復習モードとして処理される不具合を修正',
          'ノート保存・編集・削除後に画面が更新されない不具合を修正',
        ],
      },
    ],
  },
  {
    version: '0.9.0',
    date: '2026-08-14',
    title: '資格・ランクシステム強化',
    summary: '資格学習の道筋と、ゲーム感覚で続けられる成長システムを大幅に拡張しました。',
    highlights: ['7ランク', '13資格', '実績バッジ', '効果音'],
    sections: [
      {
        type: 'feature',
        label: '追加',
        items: [
          'ブロンズからSOVEREIGNまで7段階のランク紋章を追加',
          '資格スキルピラミッドと資格難易度ランキングを追加',
          '実績バッジ、正誤効果音、クイズクリア・ランク昇格演出を追加',
        ],
      },
    ],
  },
  {
    version: '0.8.0',
    date: '2026-08-13',
    title: '教材分野・復習機能拡張',
    summary: '実務につながる教材分野を増やし、苦手分野を優先して復習できるようにしました。',
    highlights: ['6分野追加', 'IT総合教本', '科目A/B', '苦手優先'],
    sections: [
      {
        type: 'feature',
        label: '追加',
        items: [
          'データ分析・モバイル・IoT・SRE・UX・ITガバナンスを追加',
          'IT総合教本83教材と科目A/B問題99問を統合',
          '未回答・不正解・苦手優先の復習モードを追加',
        ],
      },
    ],
  },
  {
    version: '0.7.0',
    date: '2026-07-23',
    title: '公開・クラウド保存対応',
    summary: '公開URLとユーザー別クラウド進捗保存に対応し、複数デバイスで学習できる基盤を整えました。',
    highlights: ['公開URL', 'クラウド同期', 'レスポンシブ', 'セキュリティ'],
    sections: [
      {
        type: 'feature',
        label: '追加',
        items: [
          'Sign in with ChatGPTによるユーザー別進捗保存を追加',
          'PC・スマートフォン・タブレット間の進捗共有に対応',
          'CSP、クリックジャッキング防止など公開環境の保護を追加',
        ],
      },
    ],
  },
]

export const currentVersion = releaseHistory[0].version
export const latestRelease = releaseHistory[0]
