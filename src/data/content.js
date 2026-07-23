import { skillCourseModules } from './skillCourses.js'

const certificationModules = {
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
          
          <div class="diagram-container">
            <h4>PDCAサイクル</h4>
            <svg viewBox="0 0 200 200" class="diagram">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#00ff88" />
                </marker>
              </defs>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#00ff88" stroke-width="2" />
              <circle cx="100" cy="20" r="30" fill="rgba(0,255,136,0.2)" stroke="#00ff88" stroke-width="2" />
              <text x="100" y="25" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Plan</text>
              
              <circle cx="170" cy="100" r="30" fill="rgba(0,255,136,0.2)" stroke="#00ff88" stroke-width="2" />
              <text x="170" y="105" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Do</text>
              
              <circle cx="100" cy="180" r="30" fill="rgba(0,255,136,0.2)" stroke="#00ff88" stroke-width="2" />
              <text x="100" y="185" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Check</text>
              
              <circle cx="30" cy="100" r="30" fill="rgba(0,255,136,0.2)" stroke="#00ff88" stroke-width="2" />
              <text x="30" y="105" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Act</text>
              
              <path d="M 120 30 Q 160 50 165 70" fill="none" stroke="#00ff88" stroke-width="2" marker-end="url(#arrow)" />
              <path d="M 170 130 Q 150 170 120 175" fill="none" stroke="#00ff88" stroke-width="2" marker-end="url(#arrow)" />
              <path d="M 80 180 Q 40 160 35 130" fill="none" stroke="#00ff88" stroke-width="2" marker-end="url(#arrow)" />
              <path d="M 30 70 Q 50 30 80 25" fill="none" stroke="#00ff88" stroke-width="2" marker-end="url(#arrow)" />
            </svg>
          </div>

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
      {
        id: 'itp-l5',
        title: 'システム企画と要件定義',
        content: `
          <h3>システム開発の最初のステップ</h3>
          <p>システム開発プロジェクトでは、まず何を作るかを明確にする必要があります。</p>
          <ul>
            <li><strong>要件定義</strong> — システムに必要な機能と性能を定義</li>
            <li><strong>機能要件</strong> — システムが何をするか（例：ユーザー登録、決済処理）</li>
            <li><strong>非機能要件</strong> — システムの品質（例：応答時間、可用性、セキュリティ）</li>
            <li><strong>RFP</strong> — 要求提案書、ベンダーへの依頼文書</li>
          </ul>
        `,
      },
      {
        id: 'itp-l6',
        title: 'システム開発手法',
        content: `
          <h3>ウォーターフォールとアジャイル</h3>
          <ul>
            <li><strong>ウォーターフォールモデル</strong> — 要件→設計→実装→テスト→運用の順序で進む</li>
            <li><strong>メリット</strong> — 各工程が明確、管理しやすい</li>
            <li><strong>デメリット</strong> — 変更に弱い、後戻りが困難</li>
            <li><strong>アジャイル開発</strong> — 短期間の反復で開発</li>
            <li><strong>スクラム</strong> — スプリント（通常2週間）ごとに機能を追加</li>
          </ul>
        `,
      },
      {
        id: 'itp-l7',
        title: 'ネットワーク基礎',
        content: `
          <h3>インターネットの仕組み</h3>
          <ul>
            <li><strong>LAN</strong> — 局域ネットワーク（オフィス内、家庭内）</li>
            <li><strong>WAN</strong> — 広域ネットワーク（インターネット）</li>
            <li><strong>IPアドレス</strong> — ネット上の住所（例：192.168.1.1）</li>
            <li><strong>サブネットマスク</strong> — ネットワーク範囲の指定</li>
            <li><strong>ルータ</strong> — ネットワーク間の通信を中継</li>
            <li><strong>スイッチングハブ</strong> — LAN内の機器を接続</li>
          </ul>
        `,
      },
      {
        id: 'itp-l8',
        title: 'データベース基礎',
        content: `
          <h3>データの管理と活用</h3>
          <ul>
            <li><strong>DBMS</strong> — データベース管理システム</li>
            <li><strong>リレーショナルDB</strong> — 表形式でデータを管理（MySQL, PostgreSQL）</li>
            <li><strong>NoSQL</strong> — 非リレーショナル（MongoDB, Redis）</li>
            <li><strong>SQL</strong> — データ操作言語（SELECT, INSERT, UPDATE, DELETE）</li>
            <li><strong>ACID特性</strong> — 原子性、一貫性、独立性、永続性</li>
          </ul>
        `,
      },
      {
        id: 'itp-l9',
        title: '情報セキュリティ基礎',
        content: `
          <h3>情報資産を守る</h3>
          <ul>
            <li><strong>機密性</strong> — 許可された人だけがアクセス可能</li>
            <li><strong>完全性</strong> — データが改ざんされていない</li>
            <li><strong>可用性</strong> — 必要時にアクセス可能</li>
            <li><strong>認証</strong> — 本人確認（パスワード、生体認証）</li>
            <li><strong>承認</strong> — アクセス権限の管理</li>
            <li><strong>暗号化</strong> — データを保護（共通鍵、公開鍵）</li>
          </ul>
        `,
      },
      {
        id: 'itp-l10',
        title: 'ITサービスマネジメント',
        content: `
          <h3>ITサービスを品質よく提供する</h3>
          <ul>
            <li><strong>ITIL</strong> — ITインフラストラクチャライブラリ</li>
            <li><strong>インシデント管理</strong> — 障害対応プロセス</li>
            <li><strong>問題管理</strong> — 根本原因の分析と対策</li>
            <li><strong>変更管理</strong> — システム変更の統制</li>
            <li><strong>構成管理</strong> — システム構成要素の管理</li>
            <li><strong>SLA</strong> — サービス品質合意</li>
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
      {
        id: 'fe-l5',
        title: 'プログラミング言語',
        content: `
          <h3>プログラミングの基礎</h3>
          <ul>
            <li><strong>変数とデータ型</strong> — 整数、浮動小数点、文字列、真偽値</li>
            <li><strong>制御構造</strong> — if文、forループ、whileループ</li>
            <li><strong>関数</strong> — 引数、戻り値、スコープ</li>
            <li><strong>配列とリスト</strong> — データの集合操作</li>
            <li><strong>オブジェクト指向</strong> — クラス、継承、ポリモーフィズム</li>
          </ul>
        `,
      },
      {
        id: 'fe-l6',
        title: 'コンパイラとインタプリタ',
        content: `
          <h3>プログラムの実行方式</h3>
          <ul>
            <li><strong>コンパイラ</strong> — ソースコードを機械語に変換して実行</li>
            <li><strong>インタプリタ</strong> — ソースコードを1行ずつ解釈して実行</li>
            <li><strong>JITコンパイル</strong> — 実行時に必要な部分をコンパイル</li>
            <li><strong>バイトコード</strong> — 中間表現（Java, Python）</li>
            <li><strong>最適化</strong> — コードの実行効率を向上</li>
          </ul>
        `,
      },
      {
        id: 'fe-l7',
        title: 'データ構造',
        content: `
          <h3>効率的なデータ管理</h3>
          <ul>
            <li><strong>配列</strong> — 固定長、ランダムアクセスO(1)</li>
            <li><strong>連結リスト</strong> — 動的、順次アクセス</li>
            <li><strong>ハッシュテーブル</strong> — キーと値のペア、O(1)検索</li>
            <li><strong>木構造</strong> — 階層データ、二分探索木</li>
            <li><strong>グラフ</strong> — ノードとエッジ、最短経路問題</li>
          </ul>
        `,
      },
      {
        id: 'fe-l8',
        title: '計算量とオーダー記法',
        content: `
          <h3>アルゴリズムの効率評価</h3>
          <ul>
            <li><strong>O(1)</strong> — 定数時間（配列アクセス）</li>
            <li><strong>O(log n)</strong> — 対数時間（二分探索）</li>
            <li><strong>O(n)</strong> — 線形時間（線形探索）</li>
            <li><strong>O(n log n)</strong> — 効率的なソート（クイックソート）</li>
            <li><strong>O(n²)</strong> — 二次時間（バブルソート）</li>
            <li><strong>最悪計算量 vs 平均計算量</strong></li>
          </ul>
        `,
      },
      {
        id: 'fe-l9',
        title: 'ハードウェア基礎',
        content: `
          <h3>コンピュータの構成要素</h3>
          <ul>
            <li><strong>CPU</strong> — 演算装置、制御装置、レジスタ</li>
            <li><strong>メモリ</strong> — RAM（主記憶）、ROM</li>
            <li><strong>キャッシュ</strong> — L1, L2, L3、高速アクセス</li>
            <li><strong>バス</strong> — データ転送路</li>
            <li><strong>入出力装置</strong> — キーボード、ディスプレイ、ストレージ</li>
            <li><strong>クロック周波数</strong> — CPUの処理速度</li>
          </ul>
        `,
      },
      {
        id: 'fe-l10',
        title: '情報理論の基礎',
        content: `
          <h3>データと符号化</h3>
          <ul>
            <li><strong>ビットとバイト</strong> — 1バイト=8ビット</li>
            <li><strong>文字コード</strong> — ASCII, Unicode, UTF-8</li>
            <li><strong>ビッグエンディアン / リトルエンディアン</strong> — バイト順</li>
            <li><strong>誤り検出</strong> — パリティビット、チェックサム</li>
            <li><strong>誤り訂正</strong> — ハミングコード、リードソロモン</li>
            <li><strong>圧縮</strong> — 可逆（ZIP）と非可逆（JPEG）</li>
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
      {
        id: 'ap-l4',
        title: 'システムアーキテクチャ',
        content: `
          <h3>システムの構成パターン</h3>
          <ul>
            <li><strong>クライアントサーバ型</strong> — サーバとクライアントの分離</li>
            <li><strong>3層アーキテクチャ</strong> — プレゼンテーション、アプリケーション、データ</li>
            <li><strong>Webシステム</strong> — Webサーバ、APサーバ、DBサーバ</li>
            <li><strong>マイクロサービス</strong> — 小さなサービスの集合</li>
            <li><strong>サーバレス</strong> — サーバ管理不要（AWS Lambda等）</li>
          </ul>
        `,
      },
      {
        id: 'ap-l5',
        title: '分散システム',
        content: `
          <h3>複数サーバでの協調処理</h3>
          <ul>
            <li><strong>負荷分散</strong> — ロードバランサによる分散</li>
            <li><strong>スケーリング</strong> — 水平スケーリング vs 垂直スケーリング</li>
            <li><strong>可用性</strong> — 冗長化、フェイルオーバー</li>
            <li><strong>一貫性</strong> — 分散トランザクション、CAP定理</li>
            <li><strong>RPC</strong> — リモートプロシージャコール</li>
          </ul>
        `,
      },
      {
        id: 'ap-l6',
        title: 'Web技術',
        content: `
          <h3>Webアプリケーションの技術</h3>
          <ul>
            <li><strong>HTTP/HTTPS</strong> — リクエスト/レスポンスモデル</li>
            <li><strong>RESTful API</strong> — リソース指向の設計</li>
            <li><strong>JSON/XML</strong> — データフォーマット</li>
            <li><strong>Cookie/Session</strong> — 状態管理</li>
            <li><strong>CORS</strong> — クロスオリジンリソースシェアリング</li>
            <li><strong>WebSocket</strong> — 双方向通信</li>
          </ul>
        `,
      },
      {
        id: 'ap-l7',
        title: '組込みシステム',
        content: `
          <h3>組込みシステムの特徴</h3>
          <ul>
            <li><strong>リアルタイムOS</strong> — 時間制約の厳しい処理</li>
            <li><strong>マイクロコントローラ</strong> — CPU、メモリ、I/O一体化</li>
            <li><strong>ファームウェア</strong> — 組込みソフトウェア</li>
            <li><strong>低消費電力設計</strong> — バッテリ駆動機器</li>
            <li><strong>IoTゲートウェイ</strong> — センサとクラウドの仲介</li>
          </ul>
        `,
      },
      {
        id: 'ap-l8',
        title: 'データマイニングと機械学習',
        content: `
          <h3>データからの知識発見</h3>
          <ul>
            <li><strong>教師あり学習</strong> — ラベル付きデータでの学習</li>
            <li><strong>教師なし学習</strong> — クラスタリング、次元削減</li>
            <li><strong>強化学習</strong> — 報酬に基づく学習</li>
            <li><strong>ディープラーニング</strong> — 多層ニューラルネットワーク</li>
            <li><strong>特徴量エンジニアリング</strong> — データの前処理</li>
          </ul>
        `,
      },
      {
        id: 'ap-l9',
        title: 'ビジネスインテリジェンス',
        content: `
          <h3>データ活用による意思決定支援</h3>
          <ul>
            <li><strong>データウェアハウス</strong> — 分析用データ統合</li>
            <li><strong>ETL</strong> — 抽出、変換、ロード</li>
            <li><strong>OLAP</strong> — 多次元分析</li>
            <li><strong>ダッシュボード</strong> — 可視化ツール</li>
            <li><strong>KPI</strong> — 重要業績評価指標</li>
          </ul>
        `,
      },
      {
        id: 'ap-l10',
        title: 'エンタープライズアーキテクチャ',
        content: `
          <h3>組織全体のシステム最適化</h3>
          <ul>
            <li><strong>TOGAF</strong> — EAフレームワーク</li>
            <li><strong>業務プロセス</strong> — BPMN、ワークフロー</li>
            <li><strong>SOA</strong> — サービス指向アーキテクチャ</li>
            <li><strong>API管理</strong> — APIゲートウェイ、マーケットプレイス</li>
            <li><strong>ガバナンス</strong> — IT資産の統制</li>
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
      {
        id: 'sec-l5',
        title: 'ネットワークスキャンと偵察',
        content: `
          <h3>情報収集の技術</h3>
          <ul>
            <li><strong>Nmap</strong> — ポートスキャン、サービス検出</li>
            <li><strong>OSINT</strong> — 公開情報の収集（Google Dorking, WHOIS）</li>
            <li><strong>Shodan</strong> — インターネット接続機器の検索エンジン</li>
            <li><strong>DNS列挙</strong> — サブドメインの発見</li>
            <li><strong>Social Engineering</strong> — 人間の心理を利用した攻撃</li>
          </ul>
          <p class="note">⚠️ 情報収集も許可なしに行うと違法となる可能性があります。</p>
        `,
      },
      {
        id: 'sec-l6',
        title: 'Webアプリケーション脆弱性',
        content: `
          <h3>OWASP Top 10</h3>
          <ul>
            <li><strong>注入（Injection）</strong> — SQL、OSコマンド、LDAP</li>
            <li><strong>認証の不備</strong> — 脆弱なパスワード、セッション管理</li>
            <li><strong>露出したデータ</strong> — 暗号化不足のデータ</li>
            <li><strong>XML外部エンティティ（XXE）</strong> — 外部エンティティの悪用</li>
            <li><strong>アクセス制御の不備</strong> — 権限昇格、水平権限昇格</li>
            <li><strong>セキュリティ設定の誤り</strong> — デフォルト設定、公開クラウドストレージ</li>
          </ul>
        `,
      },
      {
        id: 'sec-l7',
        title: '暗号技術の基礎',
        content: `
          <h3>データ保護のための暗号化</h3>
          <ul>
            <li><strong>共通鍵暗号</strong> — AES、DES（鍵共有が必要）</li>
            <li><strong>公開鍵暗号</strong> — RSA、ECC（鍵共有不要）</li>
            <li><strong>ハッシュ関数</strong> — SHA-256、MD5（一方向性）</li>
            <li><strong>デジタル署名</strong> — 改ざん検出、本人確認</li>
            <li><strong>PBKDF2</strong> — パスワードハッシュの強化</li>
            <li><strong>SSL/TLS</strong> — 通信路の暗号化</li>
          </ul>
        `,
      },
      {
        id: 'sec-l8',
        title: 'マルウェア解析',
        content: `
          <h3>悪意あるソフトウェアの分析</h3>
          <ul>
            <li><strong>ウイルス</strong> — 自己複製型</li>
            <li><strong>ワーム</strong> — ネットワーク経由で自己伝播</li>
            <li><strong>トロイの木馬</strong> — 正常なプログラムに偽装</li>
            <li><strong>ランサムウェア</strong> — データを暗号化し身代金要求</li>
            <li><strong>スパイウェア</strong> — 情報を盗み出す</li>
            <li><strong>静的解析</strong> — 逆アセンブル、コード解析</li>
            <li><strong>動的解析</strong> — サンドボックスでの実行監視</li>
          </ul>
        `,
      },
      {
        id: 'sec-l9',
        title: 'インシデントレスポンス',
        content: `
          <h3>セキュリティインシデントへの対応</h3>
          <ul>
            <li><strong>NISTフレームワーク</strong> — 検出、防御、対応、復旧</li>
            <li><strong>準備</strong> — インシデント対応計画、チーム編成</li>
            <li><strong>検出</strong> — ログ監視、異常検知</li>
            <li><strong>封じ込め</strong> — 影響範囲の限定</li>
            <li><strong>根絶</strong> — 脅威の完全除去</li>
            <li><strong>復旧</strong> — システムの正常化</li>
            <li><strong>教訓</strong> — 事後レビューと改善</li>
          </ul>
        `,
      },
      {
        id: 'sec-l10',
        title: 'セキュリティツール',
        content: `
          <h3>実務で使われるツール群</h3>
          <ul>
            <li><strong>Burp Suite</strong> — Webアプリケーションテスト</li>
            <li><strong>Metasploit</strong> — 脆弱性エクスプロイト</li>
            <li><strong>Wireshark</strong> — パケットキャプチャ</li>
            <li><strong>John the Ripper</strong> — パスワードクラック</li>
            <li><strong>Ghidra</strong> — 逆エンジニアリング</li>
            <li><strong>Splunk</strong> — SIEM、ログ分析</li>
            <li><strong>Snort</strong> — IDS（侵入検知システム）</li>
          </ul>
          <p class="note">⚠️ これらのツールは許可された環境でのみ使用してください。</p>
        `,
      },
    ],
  },
}

export const studyModules = { ...certificationModules, ...skillCourseModules }

export function getStudyModule(topicId) {
  return studyModules[topicId]
}
