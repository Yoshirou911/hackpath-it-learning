export const studyModules = {
  itp: {
    id: 'itp',
    title: 'ITパスポート',
    icon: '📘',
    color: '#00ff88',
    lessons: [
      {
        id: 'itp-l1',
        title: 'ストラテジ系 — ITとビジネス',
        content: `
          <h3>ITをビジネスに活かす</h3>
          <p>ITパスポート試験は<strong>ストラテジ系</strong>、<strong>マネジメント系</strong>、<strong>テクノロジ系</strong>の3分野から出題されます。</p>
          <p>ストラテジ系では、ITを活用した経営戦略、法務（個人情報保護法、著作権法）、企業活動におけるITの役割が問われます。</p>
          <ul>
            <li><strong>イノベーション</strong> — 新しい技術でビジネスモデルを変革</li>
            <li><strong>デジタルトランスフォーメーション（DX）</strong> — デジタル技術で業務・組織を変革</li>
            <li><strong>コンプライアンス</strong> — 法令・規則の遵守</li>
          </ul>
        `,
      },
      {
        id: 'itp-l2',
        title: 'マネジメント系 — プロジェクトとサービス',
        content: `
          <h3>プロジェクトマネジメントの基礎</h3>
          <p>マネジメント系では、プロジェクト管理、サービスマネジメント、システム監査などが出題されます。</p>
          <ul>
            <li><strong>PDCAサイクル</strong> — Plan → Do → Check → Act の改善サイクル</li>
            <li><strong>アジャイル開発</strong> — 短いスプリントで反復的に開発</li>
            <li><strong>SLA</strong> — サービス品質に関する合意</li>
            <li><strong>ITIL</strong> — ITサービス管理のベストプラクティス集</li>
          </ul>
        `,
      },
      {
        id: 'itp-l3',
        title: 'テクノロジ系 — ネットワークとデータ',
        content: `
          <h3>ITの技術基盤</h3>
          <p>テクノロジ系は試験の約半分を占める重要分野です。</p>
          <ul>
            <li><strong>ネットワーク</strong> — LAN/WAN、TCP/IP、DNS、ルータ</li>
            <li><strong>クラウド</strong> — IaaS / PaaS / SaaS の違い</li>
            <li><strong>データベース</strong> — リレーショナルDB、SQL基礎</li>
            <li><strong>セキュリティ</strong> — 暗号化、認証、マルウェア対策</li>
          </ul>
        `,
      },
      {
        id: 'itp-l4',
        title: '新技術トレンド',
        content: `
          <h3>近年の重要トピック</h3>
          <ul>
            <li><strong>IoT</strong> — モノのインターネット、スマートホーム、産業IoT</li>
            <li><strong>AI / 機械学習</strong> — 画像認識、自然言語処理、生成AI</li>
            <li><strong>ビッグデータ</strong> — 3V（Volume, Velocity, Variety）</li>
            <li><strong>ブロックチェーン</strong> — 分散型台帳技術</li>
          </ul>
        `,
      },
    ],
  },
  fe: {
    id: 'fe',
    title: '基本情報技術者',
    icon: '💻',
    color: '#00ccff',
    lessons: [
      {
        id: 'fe-l1',
        title: 'アルゴリズムとデータ構造',
        content: `
          <h3>計算の基礎</h3>
          <p>基本情報試験では疑似言語によるアルゴリズム問題が頻出です。</p>
          <ul>
            <li><strong>2進数・16進数</strong> — 数値の変換（1011₂ = 11₁₀）</li>
            <li><strong>スタック</strong> — LIFO（後入れ先出し）</li>
            <li><strong>キュー</strong> — FIFO（先入れ先出し）</li>
            <li><strong>ソート</strong> — バブルソート、クイックソート等</li>
            <li><strong>探索</strong> — 線形探索 O(n)、二分探索 O(log n)</li>
          </ul>
        `,
      },
      {
        id: 'fe-l2',
        title: 'オペレーティングシステム',
        content: `
          <h3>OSの役割</h3>
          <ul>
            <li><strong>プロセス管理</strong> — マルチタスク、スケジューリング</li>
            <li><strong>メモリ管理</strong> — 仮想メモリ、ページング</li>
            <li><strong>ファイルシステム</strong> — NTFS, ext4 等</li>
            <li><strong>デッドロック</strong> — 複数プロセスが資源を待ち合う状態</li>
          </ul>
        `,
      },
      {
        id: 'fe-l3',
        title: 'ネットワーク',
        content: `
          <h3>インターネットの仕組み</h3>
          <ul>
            <li><strong>OSI参照モデル</strong> — 7層（物理〜アプリケーション）</li>
            <li><strong>TCP/IP</strong> — 4層モデル、TCP vs UDP</li>
            <li><strong>IPアドレス</strong> — IPv4（32bit）、IPv6（128bit）</li>
            <li><strong>HTTP/HTTPS</strong> — ステータスコード 200, 404, 500</li>
            <li><strong>DNS</strong> — ドメイン名 → IPアドレス</li>
          </ul>
        `,
      },
      {
        id: 'fe-l4',
        title: 'データベース',
        content: `
          <h3>データ管理の基礎</h3>
          <ul>
            <li><strong>リレーショナルモデル</strong> — 表形式、正規化</li>
            <li><strong>主キー・外部キー</strong> — テーブル間の関連</li>
            <li><strong>SQL</strong> — SELECT, INSERT, UPDATE, DELETE</li>
            <li><strong>トランザクション</strong> — ACID特性</li>
          </ul>
        `,
      },
    ],
  },
  ap: {
    id: 'ap',
    title: '応用情報技術者',
    icon: '🎯',
    color: '#6c47ff',
    lessons: [
      {
        id: 'ap-l1',
        title: 'システム開発技術',
        content: `
          <h3>設計からテストまで</h3>
          <ul>
            <li><strong>要件定義</strong> — 機能要件 vs 非機能要件</li>
            <li><strong>UML</strong> — クラス図、シーケンス図、ユースケース図</li>
            <li><strong>デザインパターン</strong> — GoF 23パターン（Singleton, Factory等）</li>
            <li><strong>テスト</strong> — 単体・結合・システム・受入テスト</li>
          </ul>
        `,
      },
      {
        id: 'ap-l2',
        title: 'プロジェクトマネジメント',
        content: `
          <h3>プロジェクトを成功に導く</h3>
          <ul>
            <li><strong>WBS</strong> — 作業分解構造</li>
            <li><strong>ガントチャート</strong> — スケジュール可視化</li>
            <li><strong>クリティカルパス</strong> — 最短工期を決める経路</li>
            <li><strong>リスク管理</strong> — 識別 → 分析 → 対応</li>
          </ul>
        `,
      },
      {
        id: 'ap-l3',
        title: 'セキュリティ（応用レベル）',
        content: `
          <h3>情報セキュリティの体系</h3>
          <ul>
            <li><strong>CIA</strong> — 機密性・完全性・可用性</li>
            <li><strong>リスクアセスメント</strong> — 資産特定 → 脅威分析 → 対策</li>
            <li><strong>暗号化</strong> — 共通鍵 vs 公開鍵、デジタル署名</li>
            <li><strong>ISMS</strong> — ISO/IEC 27001 に基づく管理体制</li>
          </ul>
        `,
      },
    ],
  },
  sec: {
    id: 'sec',
    title: 'セキュリティ & 倫理的ハッキング',
    icon: '🔒',
    color: '#ff4466',
    lessons: [
      {
        id: 'sec-l1',
        title: 'ネットワーク基礎',
        content: `
          <h3>攻撃を理解するための基礎</h3>
          <ul>
            <li><strong>TCP/IP</strong> — 3ウェイハンドシェイク、ポート番号</li>
            <li><strong>主要ポート</strong> — 22(SSH), 80(HTTP), 443(HTTPS), 3389(RDP)</li>
            <li><strong>プロトコル</strong> — HTTP, DNS, SMTP, FTP の役割</li>
            <li><strong>パケットキャプチャ</strong> — Wireshark で通信を可視化</li>
          </ul>
        `,
      },
      {
        id: 'sec-l2',
        title: '攻撃手法の仕組み',
        content: `
          <h3>知って防ぐ — 代表的な攻撃</h3>
          <ul>
            <li><strong>SQLインジェクション</strong> — 入力値検証不足を悪用 → パラメータ化クエリで防御</li>
            <li><strong>XSS</strong> — スクリプト埋め込み → 出力エスケープで防御</li>
            <li><strong>CSRF</strong> — なりすましリクエスト → トークン検証で防御</li>
            <li><strong>フィッシング</strong> — 偽サイトで情報窃取 → 多要素認証で軽減</li>
            <li><strong>DoS/DDoS</strong> — サービス停止攻撃 → レート制限、CDN</li>
          </ul>
        `,
      },
      {
        id: 'sec-l3',
        title: 'CTF入門ガイド',
        content: `
          <h3>Capture The Flag — 安全にスキルを磨く</h3>
          <p>CTFはセキュリティスキルを競うコンテストです。フラグ（文字列）を見つける問題形式が主流です。</p>
          <ul>
            <li><strong>picoCTF</strong> — 初心者向け、無料（https://picoctf.org）</li>
            <li><strong>TryHackMe</strong> — ガイド付き学習ルーム（https://tryhackme.com）</li>
            <li><strong>Hack The Box</strong> — 実践的なマシン攻略（https://hackthebox.com）</li>
            <li><strong>カテゴリ</strong> — Web, Crypto, Forensics, Pwn, Reverse</li>
          </ul>
          <p class="note">⚠️ 許可のないシステムへの攻撃は犯罪です。必ずCTF環境や自分の環境で練習しましょう。</p>
        `,
      },
      {
        id: 'sec-l4',
        title: 'ペネトレーションテストの流れ',
        content: `
          <h3>倫理的ハッキングのプロセス</h3>
          <ol>
            <li><strong>侦察（Reconnaissance）</strong> — 対象の情報収集</li>
            <li><strong>スキャン</strong> — ポートスキャン、脆弱性スキャン</li>
            <li><strong>侵入</strong> — 脆弱性を悪用してアクセス取得</li>
            <li><strong>権限昇格</strong> — より高い権限の取得</li>
            <li><strong>持続性</strong> — アクセス維持（検証目的）</li>
            <li><strong>報告</strong> — 発見事項と対策を文書化</li>
          </ol>
          <p class="note">⚠️ ペンテストは<strong>必ず書面の許可</strong>を得てから実施します。</p>
        `,
      },
    ],
  },
}

export function getStudyModule(topicId) {
  return studyModules[topicId]
}
