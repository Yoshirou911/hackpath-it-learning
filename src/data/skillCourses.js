// 実務スキル系コース。topic / module / questions / glossary は同じIDで揃える。
// 資格系データと分離し、コース単位で追加・差し替えしやすくしている。
import {
  foundationCourseLessons,
  foundationCourseQuestions,
  foundationGlossaryTerms,
} from './foundationCourseExpansion.js'

export const skillCourseTopics = [
  topic('network', 'ネットワーク基礎', '通信の流れを図解で理解する', '🌐', '#20c997', 'TCP/IP、IPアドレス、DNS、HTTPと障害調査の基本', 10),
  topic('linux', 'Linux・OS', 'コマンド操作とOSの仕組み', '🐧', '#f5b700', 'ファイル操作、権限、プロセス、ログの読み方', 10),
  topic('database', 'データベース・SQL', 'データを正しく設計して扱う', '🗄️', '#4dabf7', 'SQL、テーブル設計、正規化、トランザクション', 10),
  topic('web', 'Web開発・API', 'Webアプリが動く仕組みを学ぶ', '🕸️', '#ff6b9d', 'HTML/CSS/JavaScript、HTTP、REST API、ブラウザ', 10),
  topic('programming', 'プログラミング', 'プログラミング基礎', '⌨️', '#a78bfa', '変数・ループ・関数・OOP・アルゴリズム', 10),
  topic('cloud', 'クラウド・DevOps', 'クラウド・DevOps基礎', '☁️', '#38bdf8', 'AWS・Docker・K8s・CI/CD・IaC', 10),
  topic('ai', 'AI・機械学習', 'AI・機械学習基礎', '🤖', '#fb923c', 'ML・DL・NLP・生成AI・倫理', 10),
  topic('git', 'Git・開発ツール', 'Git・開発ツール基礎', '🔧', '#34d399', 'Git・GitHub・PR・テスト・デバッグ', 10),
  topic('sysdesign', 'システム設計', 'システム設計基礎', '🏗️', '#f472b6', 'スケール・可用性・キャッシュ・API・マイクロサービス', 10),
]

export const skillCourseModules = {
  network: module('network', 'ネットワーク基礎', '🌐', '#20c997', [
    lesson('network-l1', 'ネットワークとTCP/IP', `
      <h3>データは層に分かれて運ばれる</h3>
      <p>インターネットでは、役割ごとに通信を分ける<strong>TCP/IPモデル</strong>が使われます。</p>
      
      <div class="diagram-container">
        <h4>TCP/IPモデル</h4>
        <svg viewBox="0 0 300 200" class="diagram">
          <rect x="50" y="10" width="200" height="35" rx="5" fill="rgba(32, 201, 151, 0.2)" stroke="#20c997" stroke-width="2" />
          <text x="150" y="32" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">アプリケーション層 (HTTP, DNS)</text>
          <rect x="50" y="55" width="200" height="35" rx="5" fill="rgba(32, 201, 151, 0.2)" stroke="#20c997" stroke-width="2" />
          <text x="150" y="77" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">トランスポート層 (TCP, UDP)</text>
          <rect x="50" y="100" width="200" height="35" rx="5" fill="rgba(32, 201, 151, 0.2)" stroke="#20c997" stroke-width="2" />
          <text x="150" y="122" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">インターネット層 (IP)</text>
          <rect x="50" y="145" width="200" height="35" rx="5" fill="rgba(32, 201, 151, 0.2)" stroke="#20c997" stroke-width="2" />
          <text x="150" y="167" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">リンク層 (Ethernet, WiFi)</text>
          <defs>
            <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#20c997" />
            </marker>
          </defs>
        </svg>
      </div>
      <ul><li><strong>アプリケーション層</strong> — HTTP、DNS</li><li><strong>トランスポート層</strong> — TCP、UDPとポート番号</li><li><strong>インターネット層</strong> — IPアドレスと経路選択</li><li><strong>リンク層</strong> — 同一ネットワーク内の転送</li></ul>
      <p class="note">障害調査では、どの層で止まっているかを順に切り分けます。</p>`),
    lesson('network-l2', 'IPアドレスとルーティング', `
      <h3>宛先までの道を選ぶ</h3>
      <ul><li><strong>IPアドレス</strong> — ネットワーク上の論理的な住所</li><li><strong>サブネット</strong> — ネットワークを範囲に分割</li><li><strong>デフォルトゲートウェイ</strong> — 別ネットワークへの出口</li><li><strong>ルータ</strong> — 次の転送先を決定</li></ul>
      <p>192.168.x.xなどは家庭や社内で使うプライベートIPアドレスです。</p>`),
    lesson('network-l3', 'DNS・HTTP・調査コマンド', `
      <h3>URLを開いたときに起こること</h3>
      <ol><li>DNSで名前解決</li><li>TCP接続を確立</li><li>HTTPSではTLSで暗号化</li><li>HTTPレスポンスを受信</li></ol>
      <p><code>ping</code>、<code>nslookup</code>、<code>tracert</code>、<code>curl</code>を使うと、段階ごとに状態を確認できます。</p>`),
    ...foundationCourseLessons.network,
  ]),
  linux: module('linux', 'Linux・OS', '🐧', '#f5b700', [
    lesson('linux-l1', 'Linuxとシェルの基本', `
      <h3>コマンドでOSを操作する</h3><p>シェルは入力したコマンドを解釈してOSへ伝えます。</p>
      <ul><li><code>pwd</code> — 現在地</li><li><code>ls</code> — 一覧表示</li><li><code>cd</code> — 移動</li><li><code>man</code> — マニュアル</li></ul>
      <p>絶対パスはルート「/」から、相対パスは現在地から表します。</p>`),
    lesson('linux-l2', 'ファイル操作・パイプ・権限', `
      <h3>小さなコマンドを組み合わせる</h3>
      <ul><li><code>cp</code> / <code>mv</code> — コピーと移動</li><li><code>grep</code> — 文字列検索</li><li><code>|</code> — 出力を次の入力へ渡す</li><li><code>chmod</code> — 読取(r)・書込(w)・実行(x)権限を変更</li></ul>
      <p class="note">権限は必要最小限にし、安易に777を設定しないことが基本です。</p>`),
    lesson('linux-l3', 'プロセス・サービス・ログ', `
      <h3>動作中のシステムを観察する</h3>
      <ul><li><code>ps</code> / <code>top</code> — プロセス確認</li><li><code>systemctl</code> — サービス管理</li><li><code>journalctl</code> — ログ確認</li><li><code>kill</code> — シグナル送信</li></ul>
      <p>障害時は状態、ログ、設定、リソース使用量の順に確認すると整理しやすくなります。</p>`),
    ...foundationCourseLessons.linux,
  ]),
  database: module('database', 'データベース・SQL', '🗄️', '#4dabf7', [
    lesson('database-l1', 'リレーショナルDBの基本', `
      <h3>表の関係でデータを表す</h3>
      
      <div class="diagram-container">
        <h4>テーブル構造の例</h4>
        <svg viewBox="0 0 300 180" class="diagram">
          <rect x="20" y="10" width="120" height="80" rx="5" fill="rgba(77, 171, 247, 0.2)" stroke="#4dabf7" stroke-width="2" />
          <text x="80" y="30" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">users</text>
          <line x1="20" y1="40" x2="140" y2="40" stroke="#4dabf7" stroke-width="1" />
          <text x="30" y="55" fill="#ffffff" font-size="10">id (PK)</text>
          <text x="30" y="70" fill="#ffffff" font-size="10">name</text>
          <text x="30" y="85" fill="#ffffff" font-size="10">email</text>
          
          <rect x="160" y="10" width="120" height="80" rx="5" fill="rgba(77, 171, 247, 0.2)" stroke="#4dabf7" stroke-width="2" />
          <text x="220" y="30" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">orders</text>
          <line x1="160" y1="40" x2="280" y2="40" stroke="#4dabf7" stroke-width="1" />
          <text x="170" y="55" fill="#ffffff" font-size="10">id (PK)</text>
          <text x="170" y="70" fill="#ffffff" font-size="10">user_id (FK)</text>
          <text x="170" y="85" fill="#ffffff" font-size="10">amount</text>
          
          <path d="M 140 65 L 160 65" stroke="#4dabf7" stroke-width="2" marker-end="url(#arrow3)" />
          
          <defs>
            <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#4dabf7" />
            </marker>
          </defs>
          
          <text x="150" y="130" text-anchor="middle" fill="#ffffff" font-size="10">外部キーで関連付け</text>
        </svg>
      </div>

      <ul><li><strong>行</strong> — 1件のデータ</li><li><strong>列</strong> — 属性</li><li><strong>主キー</strong> — 行を一意に識別</li><li><strong>外部キー</strong> — 別テーブルとの関係</li></ul>
      <p>制約を使うことで、不正なデータをDB自身が防げます。</p>`),
    lesson('database-l2', 'SELECTと集計', `
      <h3>必要なデータを問い合わせる</h3>
      <pre><code>SELECT name, score FROM users WHERE score &gt;= 80 ORDER BY score DESC;</code></pre>
      <p><code>WHERE</code>で絞り込み、<code>ORDER BY</code>で並べ替えます。集計には<code>COUNT</code>、<code>SUM</code>、<code>GROUP BY</code>を使います。</p>`),
    lesson('database-l3', 'JOIN・トランザクション・索引', `
      <h3>正しさと速さを両立する</h3>
      <p><code>JOIN</code>は関連するキーで複数テーブルを結合します。トランザクションは複数操作を一まとまりにしてACID特性を守ります。</p>
      <p>インデックスは検索を高速化しますが、保存容量と書き込みコストが増えるため検索条件に合わせて設計します。</p>`),
    ...foundationCourseLessons.database,
  ]),
  web: module('web', 'Web開発・API', '🕸️', '#ff6b9d', [
    lesson('web-l1', 'HTML・CSS・JavaScript', `
      <h3>Webページを構成する3技術</h3>
      
      <div class="diagram-container">
        <h4>Web技術の役割分担</h4>
        <svg viewBox="0 0 300 200" class="diagram">
          <rect x="20" y="20" width="80" height="60" rx="5" fill="rgba(255, 107, 157, 0.2)" stroke="#ff6b9d" stroke-width="2" />
          <text x="60" y="45" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">HTML</text>
          <text x="60" y="65" text-anchor="middle" fill="#ffffff" font-size="9">構造</text>
          
          <rect x="110" y="20" width="80" height="60" rx="5" fill="rgba(255, 107, 157, 0.2)" stroke="#ff6b9d" stroke-width="2" />
          <text x="150" y="45" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">CSS</text>
          <text x="150" y="65" text-anchor="middle" fill="#ffffff" font-size="9">見た目</text>
          
          <rect x="200" y="20" width="80" height="60" rx="5" fill="rgba(255, 107, 157, 0.2)" stroke="#ff6b9d" stroke-width="2" />
          <text x="240" y="45" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">JS</text>
          <text x="240" y="65" text-anchor="middle" fill="#ffffff" font-size="9">動作</text>
          
          <rect x="50" y="110" width="200" height="50" rx="5" fill="rgba(255, 107, 157, 0.1)" stroke="#ff6b9d" stroke-width="2" stroke-dasharray="5,5" />
          <text x="150" y="140" text-anchor="middle" fill="#ffffff" font-size="11">Webページ</text>
          
          <path d="M 60 80 L 60 110" stroke="#ff6b9d" stroke-width="2" marker-end="url(#arrow4)" />
          <path d="M 150 80 L 150 110" stroke="#ff6b9d" stroke-width="2" marker-end="url(#arrow4)" />
          <path d="M 240 80 L 240 110" stroke="#ff6b9d" stroke-width="2" marker-end="url(#arrow4)" />
          
          <defs>
            <marker id="arrow4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ff6b9d" />
            </marker>
          </defs>
        </svg>
      </div>

      <ul><li><strong>HTML</strong> — 意味と構造</li><li><strong>CSS</strong> — 見た目と配置</li><li><strong>JavaScript</strong> — 動作とデータ処理</li></ul>
      <p>役割を分けると、保守しやすくアクセシブルなページになります。</p>`),
    lesson('web-l2', 'ブラウザ・DOM・イベント', `
      <h3>HTMLをオブジェクトとして操作する</h3>
      <p>ブラウザはHTMLをDOMツリーへ変換し、JavaScriptはDOM APIで内容を変更します。</p>
      <ul><li><code>querySelector</code> — 要素を探す</li><li><code>addEventListener</code> — 操作を受け取る</li><li><code>textContent</code> — 安全に文字列を設定</li></ul>`),
    lesson('web-l3', 'HTTP・REST API・JSON', `
      <h3>クライアントとサーバーの対話</h3>
      <ul><li><strong>GET</strong> — 取得</li><li><strong>POST</strong> — 作成</li><li><strong>PATCH</strong> — 更新</li><li><strong>DELETE</strong> — 削除</li></ul>
      <p>RESTではURLをリソースとして設計し、JSONでデータを交換します。通信失敗に加えて4xx・5xxも処理します。</p>`),
    ...foundationCourseLessons.web,
  ]),
  programming: module('programming', 'プログラミング', '⌨️', '#a78bfa', [
    lesson('programming-l1', '変数とデータ型', `
      <h3>データを入れる箱</h3>
      <p>変数はデータを保存する「箱」のようなものです。JavaScriptでは<code>let</code>や<code>const</code>で宣言します。</p>
      
      <div class="diagram-container">
        <h4>主要なデータ型</h4>
        <svg viewBox="0 0 300 180" class="diagram">
          <rect x="20" y="20" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="60" y="45" text-anchor="middle" fill="#ffffff" font-size="11">String</text>
          
          <rect x="110" y="20" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="150" y="45" text-anchor="middle" fill="#ffffff" font-size="11">Number</text>
          
          <rect x="200" y="20" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="240" y="45" text-anchor="middle" fill="#ffffff" font-size="11">Boolean</text>
          
          <rect x="20" y="80" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="60" y="105" text-anchor="middle" fill="#ffffff" font-size="11">Array</text>
          
          <rect x="110" y="80" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="150" y="105" text-anchor="middle" fill="#ffffff" font-size="11">Object</text>
          
          <rect x="200" y="80" width="80" height="40" rx="5" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" stroke-width="2" />
          <text x="240" y="105" text-anchor="middle" fill="#ffffff" font-size="11">null/undefined</text>
          
          <text x="150" y="150" text-anchor="middle" fill="#ffffff" font-size="10">let name = "太郎";</text>
          <text x="150" y="165" text-anchor="middle" fill="#ffffff" font-size="10">const age = 25;</text>
        </svg>
      </div>

      <ul><li><strong>String</strong> — 文字列</li><li><strong>Number</strong> — 数値</li><li><strong>Boolean</strong> — true/false</li><li><strong>Array</strong> — 配列</li><li><strong>Object</strong> — オブジェクト</li></ul>
      <p class="note"><code>const</code>は再代入不可、<code>let</code>は再代入可能です。</p>`),
    lesson('programming-l2', '条件分岐とループ', `
      <h3>プログラムの流れを制御する</h3>
      <p><code>if</code>で条件分岐、<code>for</code>や<code>while</code>で繰り返し処理を行います。</p>
      <pre><code>if (score >= 80) {
  console.log("合格");
} else {
  console.log("不合格");
}

for (let i = 0; i < 5; i++) {
  console.log(i);
}</code></pre>
      <p><code>break</code>でループを抜け、<code>continue</code>で次の反復にスキップできます。</p>`),
    lesson('programming-l3', '関数とスコープ', `
      <h3>処理をまとめて再利用する</h3>
      <p>関数は処理のまとまりです。引数を受け取り、戻り値を返します。</p>
      <pre><code>function add(a, b) {
  return a + b;
}

const result = add(3, 5); // 8</code></pre>
      <p>スコープは変数の有効範囲です。関数内で宣言された変数は外からアクセスできません。</p>`),
    lesson('programming-l4', '配列とオブジェクト', `
      <h3>複数のデータをまとめる</h3>
      <p>配列は順序付きのデータ、オブジェクトはキーと値のペアです。</p>
      <pre><code>const fruits = ["りんご", "バナナ", "オレンジ"];
const user = { name: "太郎", age: 25, city: "東京" };</code></pre>
      <p>配列は<code>map</code>、<code>filter</code>、<code>reduce</code>などのメソッドで操作できます。</p>`),
    lesson('programming-l5', '非同期処理', `
      <h3>時間がかかる処理を扱う</h3>
      <p>Promiseやasync/awaitで非同期処理を扱います。</p>
      <pre><code>async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}</code></pre>
      <p>非同期処理はAPI呼び出しやファイル読み込みで必須です。</p>`),
    lesson('programming-l6', 'エラーハンドリング', `
      <h3>予期せぬエラーに対処する</h3>
      <p><code>try/catch</code>でエラーを捕捉します。</p>
      <pre><code>try {
  const data = JSON.parse(jsonString);
} catch (error) {
  console.error("パースエラー:", error);
}</code></pre>
      <p>エラーが発生してもアプリケーションがクラッシュしないようにします。</p>`),
    lesson('programming-l7', 'クラスとオブジェクト指向', `
      <h3>データと処理をまとめる</h3>
      <p>クラスはオブジェクトの設計図です。カプセル化、継承、ポリモーフィズムが特徴です。</p>
      <pre><code>class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log("こんにちは、" + this.name + "さん");
  }
}</code></pre>
      <p>オブジェクト指向は大規模な開発でコードの再利用性を高めます。</p>`),
    lesson('programming-l8', 'アルゴリズムとデータ構造', `
      <h3>効率的な処理を設計する</h3>
      <p>計算量（O記法）でアルゴリズムの効率を評価します。</p>
      <ul><li><strong>O(1)</strong> — 定数時間</li><li><strong>O(log n)</strong> — 対数時間</li><li><strong>O(n)</strong> — 線形時間</li><li><strong>O(n²)</strong> — 二次時間</li></ul>
      <p>適切なデータ構造（配列、連想リスト、木など）を選ぶことが重要です。</p>`),
    lesson('programming-l9', 'モジュール化と依存管理', `
      <h3>コードを分割して管理する</h3>
      <p>モジュールはコードを分割した単位です。import/exportで連携します。</p>
      <pre><code>export function add(a, b) { return a + b; }

import { add } from './utils.js';</code></pre>
      <p>npmやyarnでパッケージ管理を行います。</p>`),
    lesson('programming-l10', 'テストとデバッグ', `
      <h3>品質を保証する</h3>
      <p>単体テスト、統合テストで品質を保証します。</p>
      <pre><code>test('add関数のテスト', () => {
  expect(add(2, 3)).toBe(5);
});</code></pre>
      <p>デバッガーやconsole.logで問題を特定します。</p>`),
  ]),
  cloud: module('cloud', 'クラウド・DevOps', '☁️', '#38bdf8', [
    lesson('cloud-l1', 'クラウドサービスモデル', `
      <h3>IaaS・PaaS・SaaSの違い</h3>
      <p>クラウドは提供範囲によって3つのモデルに分類されます。</p>
      
      <div class="diagram-container">
        <h4>クラウドサービスモデル</h4>
        <svg viewBox="0 0 300 200" class="diagram">
          <rect x="20" y="20" width="260" height="40" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2" />
          <text x="150" y="45" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">SaaS (アプリケーション)</text>
          
          <rect x="40" y="70" width="220" height="40" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2" />
          <text x="150" y="95" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">PaaS (プラットフォーム)</text>
          
          <rect x="60" y="120" width="180" height="40" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2" />
          <text x="150" y="145" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">IaaS (インフラ)</text>
          
          <text x="150" y="180" text-anchor="middle" fill="#ffffff" font-size="9">ユーザーが管理する範囲が増える</text>
        </svg>
      </div>

      <ul><li><strong>IaaS</strong> — サーバー、ストレージ（AWS EC2）</li><li><strong>PaaS</strong> — 実行環境、DB（Heroku）</li><li><strong>SaaS</strong> — 完成品のアプリ（Gmail）</li></ul>
      <p class="note">管理範囲が小さいほど運用負担が減ります。</p>`),
    lesson('cloud-l2', 'AWS主要サービス', `
      <h3>代表的なAWSサービス</h3>
      <ul><li><strong>EC2</strong> — 仮想サーバー</li><li><strong>S3</strong> — オブジェクトストレージ</li><li><strong>RDS</strong> — マネージドDB</li><li><strong>Lambda</strong> — サーバーレス関数</li><li><strong>CloudFront</strong> — CDN</li></ul>
      <p>適切なサービスを選ぶことでコストと運用負担を最適化できます。</p>`),
    lesson('cloud-l3', 'コンテナとDocker', `
      <h3>環境を統一する</h3>
      <p>コンテナはアプリと依存関係をパッケージ化します。Dockerは代表的なコンテナ技術です。</p>
      <pre><code>FROM node:18
COPY . /app
RUN npm install
CMD ["npm", "start"]</code></pre>
      <p>「開発環境で動くのに本番で動かない」問題を解決します。</p>`),
    lesson('cloud-l4', 'Kubernetes', `
      <h3>コンテナを orchestrate する</h3>
      <p>Kubernetesはコンテナのデプロイ、スケーリング、管理を自動化します。</p>
      <ul><li><strong>Pod</strong> — 最小デプロイ単位</li><li><strong>Service</strong> — ネットワーク暴露</li><li><strong>Deployment</strong> — デプロイ管理</li><li><strong>Ingress</strong> — HTTPルーティング</li></ul>
      <p>大規模なコンテナ運用で必須の技術です。</p>`),
    lesson('cloud-l5', 'CI/CD', `
      <h3>自動化されたデプロイパイプライン</h3>
      <p>継続的インテグレーション（CI）と継続的デリバリー（CD）で品質と速度を両立します。</p>
      <ul><li><strong>GitHub Actions</strong> — GitHub連携</li><li><strong>GitLab CI</strong> — GitLab連携</li><li><strong>Jenkins</strong> — オンプレミス対応</li></ul>
      <p>自動テスト→自動デプロイの流れを構築します。</p>`),
    lesson('cloud-l6', 'IaC', `
      <h3>インフラをコードで管理する</h3>
      <p>TerraformやAWS CDKでインフラをコードとして定義します。</p>
      <pre><code>resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
}</code></pre>
      <p>バージョン管理、再現性、レビューが可能になります。</p>`),
    lesson('cloud-l7', '監視とロギング', `
      <h3>システムの状態を可視化する</h3>
      <p>メトリクス、ログ、トレースの3つを収集します。</p>
      <ul><li><strong>Prometheus</strong> — メトリクス収集</li><li><strong>Grafana</strong> — 可視化</li><li><strong>ELK Stack</strong> — ログ分析</li></ul>
      <p>異常検知とパフォーマンス最適化に不可欠です。</p>`),
    lesson('cloud-l8', 'セキュリティ', `
      <h3>クラウドのセキュリティ</h3>
      <p>共有責任モデルを理解します。</p>
      <ul><li><strong>IAM</strong> — アクセス管理</li><li><strong>VPC</strong> — ネットワーク分離</li><li><strong>Security Group</strong> — ファイアウォール</li><li><strong>KMS</strong> — 暗号化キー管理</li></ul>
      <p class="note">最小権限の原則を守ることが重要です。</p>`),
    lesson('cloud-l9', 'コスト最適化', `
      <h3>クラウドコストを抑える</h3>
      <p>リザーブドインスタンス、スポットインスタンス、自動スケーリングでコストを最適化します。</p>
      <ul><li><strong>Right Sizing</strong> — 適切なサイズ選択</li><li><strong>Auto Scaling</strong> — 需要に応じたスケール</li><li><strong>ライフサイクル管理</strong> — 不要リソースの削除</li></ul>
      <p>コストモニタリングとアラートを設定します。</p>`),
    lesson('cloud-l10', 'マイクロサービス', `
      <h3>アプリを小さなサービスに分割</h3>
      <p>マイクロサービスアーキテクチャでスケーラビリティと開発速度を向上します。</p>
      <ul><li><strong>API Gateway</strong> — �一入り口</li><li><strong>Service Mesh</strong> — サービス間通信</li><li><strong>イベント駆動</strong> — 非同期連携</li></ul>
      <p>運用複雑度が増えるため、適切な規模で導入します。</p>`),
  ]),
  ai: module('ai', 'AI・機械学習', '🤖', '#fb923c', [
    lesson('ai-l1', 'AIと機械学習の基礎', `
      <h3>AIの種類</h3>
      <p>AIは狭義のAI（特定タスク）と汎用AI（多様タスク）に分類されます。</p>
      <ul><li><strong>機械学習</strong> — データから学習</li><li><strong>ディープラーニング</strong> — 多層ニューラルネット</li><li><strong>生成AI</strong> — 新しいコンテンツ生成</li></ul>
      <p class="note">現在のAIは主に狭義のAIです。</p>`),
    lesson('ai-l2', '教師あり学習', `
      <h3>ラベル付きデータで学習</h3>
      <p>入力と正解のペアから学習します。</p>
      <ul><li><strong>回帰</strong> — 数値を予測</li><li><strong>分類</strong> — カテゴリを予測</li></ul>
      <p>画像認識、スパム検出などで使われます。</p>`),
    lesson('ai-l3', '教師なし学習', `
      <h3>ラベルなしデータで学習</h3>
      <p>データの構造を発見します。</p>
      <ul><li><strong>クラスタリング</strong> — グループ化</li><li><strong>次元削減</strong> — 特徴抽出</li></ul>
      <p>顧客セグメンテーションなどで使われます。</p>`),
    lesson('ai-l4', 'ディープラーニング', `
      <h3>多層ニューラルネットワーク</h3>
      <p>複数の層で特徴を自動抽出します。</p>
      <ul><li><strong>CNN</strong> — 画像処理</li><li><strong>RNN/LSTM</strong> — 時系列データ</li><li><strong>Transformer</strong> — 自然言語処理</li></ul>
      <p>大規模データと計算リソースが必要です。</p>`),
    lesson('ai-l5', '自然言語処理', `
      <h3>テキストを理解・生成する</h3>
      <p>言語モデルでテキストを処理します。</p>
      <ul><li><strong>Tokenization</strong> — 分かち書き</li><li><strong>Embedding</strong> — ベクトル化</li><li><strong>Attention</strong> — 重要度計算</li></ul>
      <p>翻訳、要約、チャットボットなどで使われます。</p>`),
    lesson('ai-l6', '生成AI', `
      <h3>新しいコンテンツを生成</h3>
      <p>テキスト、画像、音声などを生成します。</p>
      <ul><li><strong>GPT</strong> — テキスト生成</li><li><strong>DALL-E</strong> — 画像生成</li><li><strong>Whisper</strong> — 音声認識</li></ul>
      <p class="note">ハルシネーション（誤情報生成）に注意が必要です。</p>`),
    lesson('ai-l7', 'モデル評価', `
      <h3>モデルの性能を測る</h3>
      <p>適切な指標で評価します。</p>
      <ul><li><strong>正解率</strong> — 全体の正解率</li><li><strong>適合率・再現率</strong> — 不均衡データ</li><li><strong>F1スコア</strong> — 適合率と再現率の調和平均</li></ul>
      <p>検証データで汎化性能を確認します。</p>`),
    lesson('ai-l8', 'MLOps', `
      <h3>MLシステムを運用する</h3>
      <p>モデルの開発、デプロイ、監視を自動化します。</p>
      <ul><li><strong>Feature Store</strong> — 特徴管理</li><li><strong>Model Registry</strong> — モデル管理</li><li><strong>Monitoring</strong> — ドリフト検知</li></ul>
      <p>モデルの劣化を検知し、再学習をトリガーします。</p>`),
    lesson('ai-l9', 'AI倫理', `
      <h3>責任あるAI開発</h3>
      <p>バイアス、公平性、透明性を考慮します。</p>
      <ul><li><strong>公平性</strong> — 差別の排除</li><li><strong>説明可能性</strong> — 判断根拠の提示</li><li><strong>プライバシー</strong> — 個人情報保護</li></ul>
      <p class="note">AIガイドラインを遵守することが重要です。</p>`),
    lesson('ai-l10', '実践的プロジェクト', `
      <h3>AIプロジェクトの進め方</h3>
      <p>問題定義→データ収集→モデル開発→評価→デプロイのサイクルを回します。</p>
      <ul><li><strong>データ品質</strong> — 最も重要</li><li><strong>シンプルさ</strong> — まずはシンプルなモデル</li><li><strong>継続的改善</strong> — フィードバックループ</li></ul>
      <p>ビジネス価値にフォーカスします。</p>`),
  ]),
  git: module('git', 'Git・開発ツール', '🔧', '#34d399', [
    lesson('git-l1', 'Gitの基本', `
      <h3>バージョン管理システム</h3>
      <p>Gitは変更履歴を管理し、過去の状態に戻せます。</p>
      <ul><li><strong>commit</strong> — 変更の保存</li><li><strong>branch</strong> — 作業分岐</li><li><strong>merge</strong> — 分岐の統合</li></ul>
      <pre><code>git add .
git commit -m "Add feature"
git push origin main</code></pre>
      <p class="note">コミットメッセージは明確に書きます。</p>`),
    lesson('git-l2', 'ブランチ戦略', `
      <h3>効果的なブランチ管理</h3>
      <p>Git FlowやGitHub Flowでブランチ戦略を決めます。</p>
      <ul><li><strong>main</strong> — 本番環境</li><li><strong>develop</strong> — 開発環境</li><li><strong>feature</strong> — 新機能</li><li><strong>hotfix</strong> — 緊急修正</li></ul>
      <p>ブランチの目的を明確にします。</p>`),
    lesson('git-l3', 'GitHub', `
      <h3>クラウドGitホスティング</h3>
      <p>GitHubでコードを共有し、コラボレーションします。</p>
      <ul><li><strong>Pull Request</strong> — 変更の提案</li><strong>Code Review</strong> — コードレビュー</li><strong>Actions</strong> — CI/CD</li></ul>
      <p>Issuesでタスク管理、Wikiでドキュメント管理もできます。</p>`),
    lesson('git-l4', 'コンフリクト解決', `
      <h3>変更の衝突を解決する</h3>
      <p>同じ行を変更した場合にコンフリクトが発生します。</p>
      <pre><code>git pull
# コンフリクトを手動で解決
git add .
git commit</code></pre>
      <p>チームでコミュニケーションを取りながら解決します。</p>`),
    lesson('git-l5', 'テスト', `
      <h3>品質を保証する</h3>
      <p>単体テスト、統合テストを自動化します。</p>
      <pre><code>describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
});</code></pre>
      <p>テストカバレッジを追跡します。</p>`),
    lesson('git-l6', 'デバッグ', `
      <h3>バグを特定・修正する</h3>
      <p>ブレークポイント、ログ、デバッガーを使います。</p>
      <ul><li><strong>Chrome DevTools</strong> — ブラウザデバッグ</li><li><strong>VS Code Debugger</strong> — エディタデバッグ</li><li><strong>console.log</strong> — 簡易ログ</li></ul>
      <p>再現手順を明確にすることが重要です。</p>`),
    lesson('git-l7', 'LintとFormat', `
      <h3>コード品質を統一する</h3>
      <p>ESLint、Prettierでコードスタイルを統一します。</p>
      <pre><code>{
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}</code></pre>
      <p>自動フォーマットでレビュー負担を減らします。</p>`),
    lesson('git-l8', 'パッケージ管理', `
      <h3>依存関係を管理する</h3>
      <p>npm、yarnでパッケージを管理します。</p>
      <pre><code>npm install lodash
npm install --save-dev jest</code></pre>
      <p>package-lock.jsonでバージョンを固定します。</p>`),
    lesson('git-l9', 'ドキュメント', `
      <h3>知識を共有する</h3>
      <p>README、APIドキュメント、コメントで知識を文書化します。</p>
      <ul><li><strong>README.md</strong> — プロジェクト概要</li><li><strong>JSDoc</strong> — APIドキュメント</li><li><strong>コメント</strong> — 複雑なロジックの説明</li></ul>
      <p class="note">コードは「書く時間」より「読む時間」が長いです。</p>`),
    lesson('git-l10', 'コードレビュー', `
      <h3>品質を高める協業</h3>
      <p>Pull Requestでコードレビューを行います。</p>
      <ul><li><strong>明確な説明</strong> — 変更の意図</li><strong>建設的フィードバック</strong> — 具体的な改善案</li><strong>小さなPR</strong> — レビュー負担軽減</li></ul>
      <p>学びの機会として捉えます。</p>`),
  ]),
  sysdesign: module('sysdesign', 'システム設計', '🏗️', '#f472b6', [
    lesson('sysdesign-l1', 'スケーラビリティ', `
      <h3>負荷増加に対応する</h3>
      <p>垂直スケーリング（スケールアップ）と水平スケーリング（スケールアウト）があります。</p>
      <ul><li><strong>垂直</strong> — サーバー強化</li><li><strong>水平</strong> — サーバー追加</li></ul>
      <p>水平スケーリングの方が柔軟性が高く、コスト効率も良いです。</p>`),
    lesson('sysdesign-l2', '可用性', `
      <h3>システムを止めない</h3>
      <p>冗長化、フェイルオーバーで可用性を高めます。</p>
      <ul><li><strong>冗長化</strong> — 重複配置</li><strong>負荷分散</strong> — トラフィック分散</li><strong>フェイルオーバー</strong> — 自動切り替え</li></ul>
      <p>99.9%の可用性は月に約43分の停止を許容します。</p>`),
    lesson('sysdesign-l3', 'キャッシュ', `
      <h3>高速化と負荷軽減</h3>
      <p>キャッシュでデータを一時保存し、アクセスを高速化します。</p>
      <ul><li><strong>ブラウザキャッシュ</strong> — クライアント側</li><strong>CDN</strong> — エッジ側</li><strong>Redis</strong> — サーバー側</li></ul>
      <p class="note">キャッシュ無効化戦略も重要です。</p>`),
    lesson('sysdesign-l4', 'データベース設計', `
      <h3>適切なDBを選ぶ</h3>
      <p>RDBMSとNoSQLの使い分けが重要です。</p>
      <ul><li><strong>RDBMS</strong> — トランザクション、複雑なクエリ</li><li><strong>NoSQL</strong> — スケーラビリティ、柔軟性</li></ul>
      <p>ACID要件とCAP定理を考慮します。</p>`),
    lesson('sysdesign-l5', 'API設計', `
      <h3>良いAPIを設計する</h3>
      <p>REST、GraphQLでAPIを設計します。</p>
      <ul><li><strong>REST</strong> — リソース指向</li><strong>GraphQL</strong> — クエリ指向</li><strong>gRPC</strong> — 高性能RPC</li></ul>
      <p>バージョニング、エラーハンドリング、レート制限を設計します。</p>`),
    lesson('sysdesign-l6', 'マイクロサービス', `
      <h3>サービスを分割する</h3>
      <p>単一責任原則でサービスを分割します。</p>
      <ul><li><strong>利点</strong> — スケーラビリティ、技術的自由</li><strong>欠点</strong> — 運用複雑度、ネットワーク遅延</li></ul>
      <p>モノリスから徐々に移行するのが現実的です。</p>`),
    lesson('sysdesign-l7', 'メッセージキュー', `
      <h3>非同期通信を実現</h3>
      <p>Kafka、RabbitMQでメッセージをキューイングします。</p>
      <ul><li><strong>デカップリング</strong> — 依存関係削減</li><strong>バッファリング</strong> — 負荷平準化</li><strong>再試行</strong> — 信頼性向上</li></ul>
      <p>イベント駆動アーキテクチャの基盤です。</p>`),
    lesson('sysdesign-l8', 'セキュリティ設計', `
      <h3>セキュアなシステムを設計</h3>
      <p>認証、認可、暗号化を設計します。</p>
      <ul><li><strong>認証</strong> — 本人確認（JWT、OAuth）</li><strong>認可</strong> — アクセス制御（RBAC）</li><strong>暗号化</strong> — TLS、AES</li></ul>
      <p class="note">最小権限の原則と防御の深さを守ります。</p>`),
    lesson('sysdesign-l9', '監視とオブザーバビリティ', `
      <h3>システムの状態を把握</h3>
      <p>メトリクス、ログ、トレースを収集します。</p>
      <ul><li><strong>SLI/SLO</strong> — サービス品質目標</li><strong>アラート</strong> — 異常通知</li><strong>ダッシュボード</strong> — 可視化</li></ul>
      <p>MTTR（平均復旧時間）を短縮します。</p>`),
    lesson('sysdesign-l10', 'コスト設計', `
      <h3>コストを最適化</h3>
      <p>アーキテクチャでコストを最適化します。</p>
      <ul><li><strong>スポットインスタンス</strong> — 割安リソース</li><strong>ライフサイクル管理</strong> — 不要リソース削除</li><strong>予約購入</strong> — 長期利用割引</li></ul>
      <p>コストモニタリングと予算管理を行います。</p>`),
  ]),
}

export const skillQuestions = [
  q('programming-1', 'programming', 'プログラミングにおいて、データを入れる箱のような役割を持つものはどれか。', ['関数', '変数', 'ループ', 'クラス'], 1, '解説1'),
  q('programming-2', 'programming', 'JavaScriptで変数を宣言するキーワードはどれか。', ['let', 'int', 'string', 'def'], 0, '解説2'),
  q('programming-3', 'programming', '条件分岐を行う構文はどれか。', ['for', 'while', 'if', 'function'], 2, '解説3'),
  q('programming-4', 'programming', '同じ処理を繰り返す構文はどれか。', ['if', 'switch', 'for', 'try'], 2, '解説4'),
  q('programming-5', 'programming', '処理のまとまりを定義し、再利用可能にするものはどれか。', ['関数', '配列', '変数', '真偽値'], 0, '解説5'),
  q('programming-6', 'programming', '複数のデータを順序付けて管理するデータ構造はどれか。', ['オブジェクト', '変数', '関数', '配列'], 3, '解説6'),
  q('programming-7', 'programming', 'キーと値のペアでデータを管理するデータ構造はどれか。', ['配列', 'オブジェクト', 'ループ', 'クラス'], 1, '解説7'),
  q('programming-8', 'programming', '予期せぬエラーに対応するための構文はどれか。', ['if/else', 'for/while', 'try/catch', 'switch/case'], 2, '解説8'),
  q('programming-9', 'programming', 'アルゴリズムの計算量を表す記号はどれか。', ['O記法', 'A記法', 'X記法', 'N記法'], 0, '解説9'),
  q('programming-10', 'programming', 'オブジェクト指向の4原則に含まれないものはどれか。', ['カプセル化', '継承', 'コンパイル', 'ポリモーフィズム'], 2, '解説10'),
  q('programming-11', 'programming', 'JavaScriptで文字列をコンソールに出力するメソッドはどれか。', ['print()', 'console.log()', 'echo()', 'write()'], 1, '解説11'),
  q('programming-12', 'programming', '真偽値を表すデータ型はどれか。', ['String', 'Number', 'Boolean', 'Array'], 2, '解説12'),
  q('programming-13', 'programming', '配列の最初の要素のインデックス番号はどれか。', ['0', '1', '-1', '2'], 0, '解説13'),
  q('programming-14', 'programming', 'JSONは何の略か。', ['JavaScript Object Notation', 'Java Standard Output Network', 'Just Some Ordinary Notes', 'JSON Object Notation'], 0, '解説14'),
  q('programming-15', 'programming', 'ループ処理を途中で終了するキーワードはどれか。', ['stop', 'exit', 'break', 'return'], 2, '解説15'),
  q('programming-16', 'programming', '戻り値を返すためのキーワードはどれか。', ['output', 'return', 'give', 'yield'], 1, '解説16'),
  q('programming-17', 'programming', '線形探索の計算量はどれか。', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2, '解説17'),
  q('programming-18', 'programming', 'カプセル化の目的はどれか。', ['実行速度を上げる', 'データと処理を隠蔽する', 'コードを短くする', 'メモリを節約する'], 1, '解説18'),
  q('programming-19', 'programming', '変数に文字列を代入する正しい書き方はどれか。', ['let name = 太郎;', 'let name = "太郎";', 'let "name" = 太郎;', 'name let = "太郎";'], 1, '解説19'),
  q('programming-20', 'programming', '例外が発生した際に実行されるブロックはどれか。', ['try', 'catch', 'finally', 'else'], 1, '解説20'),
  // クラウド・DevOps（20問）
  q('cloud-1',  'cloud', 'IaaSの説明として正しいものはどれか。', ['ソフトウェアを提供するサービス', 'インフラ（サーバー・ストレージ）を提供するサービス', 'プラットフォームを提供するサービス', 'データベースのみを提供するサービス'], 1, 'IaaSはInfrastructure as Serviceの略で、仮想サーバーやストレージなどのインフラをクラウドで提供します。EC2はその代表例です。'),
  q('cloud-2',  'cloud', 'AWSのオブジェクトストレージサービスはどれか。', ['EC2', 'RDS', 'S3', 'Lambda'], 2, 'S3（Simple Storage Service）は容量無制限のオブジェクトストレージです。画像・動画・バックアップなど幅広く使われます。'),
  q('cloud-3',  'cloud', 'サーバーレスコンピューティングの説明として正しいものはどれか。', ['物理サーバーが不要になる技術', 'コードだけを書けばサーバー管理不要で実行できる仕組み', 'サーバーが自動的に削除される機能', 'クラウドを使わない仕組み'], 1, 'Lambdaなどのサーバーレスサービスは、コードをアップロードするだけで実行環境の管理が不要です。'),
  q('cloud-4',  'cloud', 'Dockerの主な目的はどれか。', ['OSの仮想化', 'アプリと実行環境をコンテナとしてまとめて移植性を高める', 'ネットワークの監視', 'データベースの管理'], 1, 'Dockerはコンテナ技術を使い、アプリを環境に依存せず動かせるようにします。「手元では動くのに本番で動かない」問題を解決します。'),
  q('cloud-5',  'cloud', 'CI（継続的インテグレーション）の主な目的はどれか。', ['コードを自動でデプロイする', 'コードを統合するたびに自動でビルド・テストを行う', 'インフラをコードで管理する', 'コストを削減する'], 1, 'CIはコードをリポジトリへ統合するたびに自動テストを実行し、バグを早期に発見します。'),
  q('cloud-6',  'cloud', 'Kubernetesの主な役割はどれか。', ['コンテナイメージのビルド', 'コンテナの運用管理（オーケストレーション）の自動化', 'データベースのクラスタリング', 'クラウドのコスト最適化'], 1, 'K8sはコンテナの配置・スケーリング・自己修復・ロードバランシングを自動化します。'),
  q('cloud-7',  'cloud', 'IaC（Infrastructure as Code）のメリットとして正しいものはどれか。', ['インフラ構築が手動になる', 'インフラの設定をコードで管理し再現性・レビューが可能になる', 'コードが不要になる', 'ハードウェアが自動注文される'], 1, 'IaCはTerraformなどでインフラをコード化し、バージョン管理・差分確認・再現が容易になります。'),
  q('cloud-8',  'cloud', 'クラウドのVPC（Virtual Private Cloud）の説明として正しいものはどれか。', ['仮想的なプライベートネットワーク空間', '仮想CPUのこと', 'クラウドの課金単位', 'コンテナの実行環境'], 0, 'VPCはクラウド上に作る論理的に隔離されたネットワーク空間です。サブネット・セキュリティグループ・ルーティングを設定します。'),
  q('cloud-9',  'cloud', 'クラウドの「責任共有モデル」の説明として正しいものはどれか。', ['全てクラウド事業者の責任', '全て利用者の責任', 'クラウド事業者と利用者で責任範囲を分担する', 'セキュリティは政府の責任'], 2, '物理インフラはクラウド事業者の責任、OSや設定・データは利用者の責任という考え方です。'),
  q('cloud-10', 'cloud', 'AWSのIAMで設定するものとして正しいものはどれか。', ['サーバーのスペック', 'ユーザーやサービスのアクセス権限', 'ネットワーク帯域幅', 'ディスク容量'], 1, 'IAM（Identity and Access Management）はAWSリソースへのアクセス権限を管理します。最小権限の原則に従います。'),
  q('cloud-11', 'cloud', 'コンテナと仮想マシン（VM）の比較として正しいものはどれか。', ['VMの方が起動が速い', 'コンテナはOSカーネルを共有するため軽量・高速', 'コンテナはセキュリティが優れる', '両者は同じ技術'], 1, 'コンテナはホストOSのカーネルを共有するため、VMより起動が速くリソース消費が少ないです。'),
  q('cloud-12', 'cloud', 'GitHubActionsで自動実行されるトリガーとして一般的なものはどれか。', ['ファイルの削除', 'コードのプッシュ', 'サーバーの再起動', 'メールの受信'], 1, 'GitHub ActionsではPushやPull Requestをトリガーにワークフロー（テスト・ビルド・デプロイ）を自動実行します。'),
  q('cloud-13', 'cloud', 'クラウドの監視ツールPrometheusが収集するものはどれか。', ['画像ファイル', 'メトリクス（CPU使用率・メモリ等の数値データ）', 'ソースコード', 'ユーザーパスワード'], 1, 'Prometheusは時系列のメトリクスデータを収集・保存し、Grafanaで可視化します。'),
  q('cloud-14', 'cloud', 'AWSのEC2の説明として正しいものはどれか。', ['Elastic Container Cluster', 'Elastic Compute Cloud（仮想サーバー）', 'External Cache Controller', 'Email Conversion Client'], 1, 'EC2はAWSの仮想サーバーサービスで、様々なスペックのインスタンスを必要に応じて起動・停止できます。'),
  q('cloud-15', 'cloud', 'SaaSの例として正しいものはどれか。', ['AWS EC2', 'Google Workspace（Gmail等）', 'Docker Hub', 'Terraform'], 1, 'SaaSはソフトウェアをクラウドで提供するモデルです。ユーザーはインストール不要でブラウザから利用できます。'),
  q('cloud-16', 'cloud', 'コンテナの設計ファイルを「Dockerfile」と呼ぶが、その役割はどれか。', ['コンテナの実行ログ', 'コンテナイメージのビルド手順を記述するファイル', 'Kubernetesの設定ファイル', 'CI/CDのパイプライン定義'], 1, 'Dockerfileにはベースイメージ・コマンド・ポートなどを記述し、docker buildでイメージを作成します。'),
  q('cloud-17', 'cloud', 'クラウドの「リザーブドインスタンス」の特徴はどれか。', ['使った分だけ課金される', '1〜3年の契約で割引価格で利用できる', '無料で使える', '他人と共有して使う'], 1, 'リザーブドインスタンスは一定期間を事前予約することで最大75%のコスト削減が可能です。'),
  q('cloud-18', 'cloud', 'クラウドの水平スケールの説明として正しいものはどれか。', ['サーバー1台のスペックを上げる', '同じサーバーを複数台に増やす', 'データを圧縮する', 'ネットワーク速度を上げる'], 1, '水平スケール（スケールアウト）はサーバー台数を増やすことで負荷を分散します。クラウドが得意とする拡張方法です。'),
  q('cloud-19', 'cloud', 'Kubernetes（K8s）のPodの説明として正しいものはどれか。', ['データベースのテーブル', 'K8sでコンテナを実行する最小単位', 'クラスターのマスターノード', 'ネットワークの設定'], 1, 'PodはK8sの基本単位で、1つ以上のコンテナをまとめたものです。同じPod内のコンテナはネットワークを共有します。'),
  q('cloud-20', 'cloud', 'FinOpsの目的はどれか。', ['金融機関向けのシステム開発', 'クラウドコストの最適化・可視化・管理', '暗号通貨の取引', 'セキュリティの強化'], 1, 'FinOpsはFinancial Operationsの略で、クラウド費用を最適化するためのフレームワークです。無駄なリソースを削減します。'),

  // AI・機械学習（20問）
  q('ai-1',  'ai', '機械学習において、正解データ（ラベル）を用いて学習する手法はどれか。', ['教師なし学習', '強化学習', '教師あり学習', '半教師あり学習'], 2, '教師あり学習は「入力と正解のペア」から学習し、回帰や分類に使われます。'),
  q('ai-2',  'ai', '正解データなしでデータのパターンを学習する手法はどれか。', ['教師あり学習', '教師なし学習', '深層学習', '転移学習'], 1, '教師なし学習はクラスタリングや次元削減などに使われます。正解ラベルが不要です。'),
  q('ai-3',  'ai', '画像認識に特に優れたニューラルネットワークはどれか。', ['RNN', 'LSTM', 'CNN', 'GAN'], 2, 'CNN（畳み込みニューラルネットワーク）は画像の特徴（エッジ・形状）を効率的に抽出します。'),
  q('ai-4',  'ai', '時系列データや自然言語の処理に優れたネットワークはどれか。', ['CNN', 'RNN/LSTM', 'SVM', 'k-NN'], 1, 'RNN（リカレントニューラルネットワーク）は時系列の文脈を考慮した処理が得意です。LSTMはその改良版です。'),
  q('ai-5',  'ai', 'LLM（大規模言語モデル）の「ハルシネーション」とは何か。', ['モデルの処理速度低下', 'もっともらしい誤った情報を生成してしまう現象', '学習データの過学習', 'GPUの過熱'], 1, 'ハルシネーションはAIが事実と異なる情報を自信を持って回答してしまう問題です。重要な判断への利用には注意が必要です。'),
  q('ai-6',  'ai', '機械学習で「過学習（Overfitting）」が起きている状態はどれか。', ['訓練データにも未知データにも精度が低い', '訓練データの精度は高いが未知データの精度が低い', '未知データのみ精度が高い', '学習が終わらない'], 1, '過学習は訓練データを丸暗記してしまい、未知データへの汎化性能が下がる状態です。'),
  q('ai-7',  'ai', 'RAG（Retrieval-Augmented Generation）の説明として正しいものはどれか。', ['画像を生成するAI技術', 'LLMが外部データベースを検索し回答を生成する技術', '音声を文字に変換する技術', 'データを暗号化する技術'], 1, 'RAGはLLMの知識不足や最新情報の欠如を、外部検索で補う技術です。社内文書の検索などに使われます。'),
  q('ai-8',  'ai', '機械学習の作業で最も多くの時間を占めるといわれるものはどれか。', ['モデルの選択', 'データの収集・前処理', 'モデルの評価', 'デプロイ'], 1, 'データの収集・クレンジング・特徴量エンジニアリングが全体の80%を占めるといわれます。'),
  q('ai-9',  'ai', '精度（Accuracy）では評価が難しい場合に使われるF1スコアはどれか。', ['精度と再現率の調和平均', '精度と特異度の平均', '損失関数の値', '学習率の逆数'], 0, 'F1スコアは適合率（Precision）と再現率（Recall）の調和平均です。不均衡なデータセットで特に有用です。'),
  q('ai-10', 'ai', 'Word2Vecが行うことはどれか。', ['単語を画像に変換する', '単語をベクトル（数値）に変換して意味的な関係を表す', '単語を音声に変換する', '単語の誤字を修正する'], 1, 'Word2Vecは単語をベクトル空間に埋め込み、意味的に近い単語が近い位置に来るよう学習します。'),
  q('ai-11', 'ai', 'AIが「なぜその判断をしたか」を説明可能にする分野はどれか。', ['強化学習', '説明可能AI（XAI）', 'データ拡張', 'バッチ正規化'], 1, 'XAI（Explainable AI）はAIの判断根拠を人間が理解できるようにする研究分野です。医療や金融での信頼性に重要です。'),
  q('ai-12', 'ai', 'k-means法が行うことはどれか。', ['回帰分析', 'データをk個のクラスタ（グループ）に分ける', '決定木の構築', '画像の生成'], 1, 'k-meansは教師なし学習のクラスタリング手法で、データをk個のグループに分類します。'),
  q('ai-13', 'ai', 'ファインチューニングの説明として正しいものはどれか。', ['モデルをゼロから学習させる', '学習済みモデルを特定のタスク向けに再学習させる', 'モデルを削除する', 'データを増やす技術'], 1, '事前学習済みの大きなモデルを、少量の特定データで追加学習することでタスクへの適応を高めます。'),
  q('ai-14', 'ai', '次元削減に使われるPCAとは何か。', ['Principal Component Analysis（主成分分析）', 'Parallel Computing Algorithm', 'Pre-trained CNN Architecture', 'Pattern Classification Algorithm'], 0, 'PCAは多次元データの特徴を保ちながら低次元に圧縮する手法です。可視化や計算効率化に使います。'),
  q('ai-15', 'ai', 'Transformerアーキテクチャの主な特徴はどれか。', ['画像処理に特化している', 'Attentionメカニズムにより文脈を効率的に処理する', '音声認識のみに使われる', '教師なし学習専用'], 1, 'TransformerはRNNの代わりにSelf-Attentionで入力全体の関係性を並列処理します。GPTやBERTの基盤です。'),
  q('ai-16', 'ai', 'AIのバイアス問題として正しいものはどれか。', ['計算が遅くなること', '学習データの偏りによって不公平な判断が生まれること', 'モデルが大きくなること', 'メモリ使用量が増えること'], 1, '学習データに特定の偏り（性別・人種等）があると、AIがその偏りを学習して差別的な判断をする可能性があります。'),
  q('ai-17', 'ai', 'プロンプトエンジニアリングとは何か。', ['AIモデルを一から作ること', 'AIに指示する文章を工夫して望む出力を引き出す技術', '量子コンピュータのプログラミング', 'データを加工すること'], 1, '生成AIへの指示（プロンプト）の書き方を工夫することで、回答の精度を大幅に改善できます。'),
  q('ai-18', 'ai', '深層学習が普及した主な要因として正しいものはどれか。', ['アルゴリズムが単純になった', 'ビッグデータの増加とGPUの性能向上', 'インターネットの普及のみ', 'プログラム言語の進化のみ'], 1, 'ビッグデータ（大量の学習データ）とGPU（並列計算に特化したチップ）の普及が深層学習ブームを起こしました。'),
  q('ai-19', 'ai', '生成AIが画像を生成する技術の代表例はどれか。', ['CNN', '拡散モデル（Diffusion Model）', 'k-means', 'SVM'], 1, '拡散モデルはノイズを除去してデータを生成する手法で、Stable DiffusionやDALL-Eなどに使われています。'),
  q('ai-20', 'ai', 'AI倫理において「透明性」が求められる理由はどれか。', ['処理速度を上げるため', 'AIの判断を人間が理解・検証・修正できるようにするため', 'コストを下げるため', 'モデルを小さくするため'], 1, 'AIシステムの判断根拠が不透明だと、誤った判断に気づけず、説明責任も果たせません。'),

  // Git・開発ツール（20問）
  q('git-1',  'git', 'Gitでファイルの変更を記録する操作はどれか。', ['push', 'commit', 'pull', 'clone'], 1, 'git commitはファイルの変更をリポジトリに記録します。メッセージで変更内容を説明します。'),
  q('git-2',  'git', '分岐した開発ラインを本流に統合する操作はどれか。', ['branch', 'merge', 'stash', 'tag'], 1, 'git mergeは別のブランチの変更を現在のブランチへ取り込みます。'),
  q('git-3',  'git', 'リモートリポジトリの変更をローカルに取り込む操作はどれか。', ['push', 'fetch', 'pull', 'clone'], 2, 'git pullはリモートの変更を取得（fetch）してローカルブランチへマージまで行います。'),
  q('git-4',  'git', 'ローカルの変更をリモートリポジトリへ送る操作はどれか。', ['push', 'commit', 'pull', 'merge'], 0, 'git pushはコミット済みの変更をリモートリポジトリへ送信します。'),
  q('git-5',  'git', 'プルリクエスト（PR）の主な目的はどれか。', ['ファイルを削除する', '変更を本流へ取り込んでもらうよう依頼しコードレビューを受ける', 'リポジトリを複製する', '過去のコミットを削除する'], 1, 'PRはチームによるコードレビューと変更の承認フローを提供します。品質向上に重要です。'),
  q('git-6',  'git', '.gitignoreファイルに記述するものはどれか。', ['追跡したいファイル一覧', 'Gitの管理から除外したいファイルのパターン', 'コミットメッセージ', 'ブランチ名'], 1, '.gitignoreにはnode_modules/や.envなどGitで追跡しないファイル・ディレクトリを記述します。'),
  q('git-7',  'git', 'git stashの用途はどれか。', ['変更を永久に削除する', '作業中の変更を一時退避する', 'コミット履歴を見る', 'ブランチを削除する'], 1, 'git stashはコミット前の変更を一時的に保存し、後で取り出せます。ブランチ切り替え時などに便利です。'),
  q('git-8',  'git', 'ユニットテストの説明として正しいものはどれか。', ['システム全体の動作確認', '関数やモジュールの最小単位の動作確認', 'ブラウザ操作の自動テスト', 'ネットワーク通信のテスト'], 1, 'ユニットテストは最小単位の関数やメソッドが期待通りに動くか確認します。バグを最も早い段階で発見できます。'),
  q('git-9',  'git', 'TDD（テスト駆動開発）の手順として正しいものはどれか。', ['コードを書いてからテストを書く', 'テストを先に書き、そのテストが通るようにコードを書く', 'テストを書かない', '本番環境でテストする'], 1, 'TDDは「レッド（失敗テスト作成）→グリーン（最小限の実装）→リファクタリング」のサイクルで開発します。'),
  q('git-10', 'git', 'Lintツールの役割はどれか。', ['コードを実行する', 'コードの構文エラー・スタイル違反を静的に検出する', 'コードを暗号化する', 'コードを圧縮する'], 1, 'ESLint（JS）やPylint（Python）などのLintツールはコードを実行せず解析して問題を指摘します。'),
  q('git-11', 'git', 'git cloneの説明として正しいものはどれか。', ['ブランチを複製する', 'リモートリポジトリをローカルに複製する', 'コミットをコピーする', '同じファイルを二重に作成する'], 1, 'git cloneはリモートリポジトリ全体（履歴含む）をローカルにコピーします。'),
  q('git-12', 'git', 'Git Flowにおけるmainブランチの役割はどれか。', ['開発のベースブランチ', '常にリリース可能な本番用コードを管理するブランチ', '実験用のブランチ', '個人の作業ブランチ'], 1, 'mainブランチ（旧master）は常にリリース可能な状態を保ちます。直接コミットせずPR経由でマージします。'),
  q('git-13', 'git', 'コンフリクト（競合）が発生する状況はどれか。', ['新しいファイルを追加したとき', '複数人が同じファイルの同じ行を変更してマージしようとしたとき', 'ブランチを作成したとき', 'コミットメッセージを書いたとき'], 1, 'コンフリクトはGitが自動でどちらの変更を採用すべきか判断できない場合に発生します。手動で解決が必要です。'),
  q('git-14', 'git', 'VSCodeで役立つ機能として一般的でないものはどれか。', ['コード補完', 'デバッグ機能', '拡張機能（プラグイン）', 'データベースのバックアップ'], 3, 'VSCodeはコード補完・デバッグ・Git統合・豊富な拡張機能を持つ人気のエディタです。DBバックアップは別ツールです。'),
  q('git-15', 'git', 'E2E（End-to-End）テストの説明として正しいものはどれか。', ['関数の単体テスト', 'ユーザーの実際の操作をシミュレートする統合テスト', 'コードの静的解析', 'APIの単体テスト'], 1, 'E2EテストはPlaywrightやCypressなどのツールでブラウザ操作を自動化し、ユーザー視点の動作を確認します。'),
  q('git-16', 'git', 'コードレビューで確認すべき項目として重要でないものはどれか。', ['コードの可読性', 'バグや脆弱性の有無', 'ロジックの正しさ', 'コーダーの名前'], 3, 'コードレビューは品質向上・バグ発見・知識共有が目的です。作者の名前ではなくコードの内容を評価します。'),
  q('git-17', 'git', 'git logコマンドの用途はどれか。', ['ファイルを記録する', 'コミット履歴を表示する', 'ブランチを一覧表示する', 'リモートの状態を確認する'], 1, 'git logはコミット履歴（コミットID・著者・日時・メッセージ）を表示します。'),
  q('git-18', 'git', 'GitHubのFork機能の説明として正しいものはどれか。', ['リポジトリを削除する', '他人のリポジトリを自分のアカウントに複製する', 'ブランチを統合する', 'コミットを取り消す'], 1, 'Forkはオープンソースプロジェクトへの貢献（コントリビュート）の出発点です。Forkして変更しPRを送ります。'),
  q('git-19', 'git', 'デバッグで「二分法（バイナリサーチ）」を使う場面はどれか。', ['バグの原因を半分ずつ絞り込んでいく', '変数を2つ使う', 'ソートアルゴリズムのデバッグ', '二進数変換のバグ修正'], 0, '「どこまでは正常か」を半分ずつ確認して絞り込む手法で、大量のコードからバグを素早く特定できます。'),
  q('git-20', 'git', 'Prettierの主な役割はどれか。', ['コードの実行', 'コードのフォーマット（整形）を自動で行う', 'テストの実行', 'デプロイの自動化'], 1, 'Prettierはコードのインデント・改行・スペースなどを自動整形するツールです。チームで統一されたスタイルを保てます。'),

  // システム設計（20問）
  q('sysdesign-1',  'sysdesign', 'システムの非機能要件に含まれるものはどれか。', ['ユーザーがログインできる', '検索機能がある', '99.9%の可用性を確保する', '商品を購入できる'], 2, '非機能要件は「どうあるべきか」を定義します。性能・信頼性・セキュリティ・スケーラビリティなどが含まれます。'),
  q('sysdesign-2',  'sysdesign', '水平スケール（スケールアウト）の説明として正しいものはどれか。', ['サーバー1台のCPUやメモリを増強する', 'サーバーの台数を増やして負荷を分散する', 'データベースを圧縮する', 'ネットワーク速度を上げる'], 1, '水平スケールはサーバー台数を増やすことで負荷に対応します。垂直スケール（スペックアップ）と対比して覚えましょう。'),
  q('sysdesign-3',  'sysdesign', 'SPOF（Single Point of Failure）の意味はどれか。', ['最高性能サーバー', '単一障害点：そこが壊れるとシステム全体が止まる箇所', 'セキュリティの脆弱性', 'データの単一バックアップ'], 1, 'SPOFをなくすために冗長化（予備を用意）します。例：DBをプライマリ+レプリカ構成にする。'),
  q('sysdesign-4',  'sysdesign', 'Redisが主にキャッシュとして使われる理由はどれか。', ['SQL対応', 'インメモリで高速な読み書きができる', 'ディスク容量が大きい', '無料で使える'], 1, 'Redisはデータをメモリ上に保持するため、データベースより桁違いに高速です。セッションやクエリ結果のキャッシュに最適です。'),
  q('sysdesign-5',  'sysdesign', 'データベースのレプリケーションの目的はどれか。', ['データを暗号化する', 'データを複数のサーバーに複製して可用性と読み取り性能を向上させる', 'データをバックアップする', 'テーブルを正規化する'], 1, 'レプリケーションはプライマリDBへの書き込みをレプリカに複製します。プライマリ障害時にレプリカへの切り替えも可能です。'),
  q('sysdesign-6',  'sysdesign', 'RESTful APIの設計でURLはどうあるべきか。', ['動詞（動作）を使う', '名詞（リソース）を使う', 'ランダムな文字列', 'クエリパラメータのみ使う'], 1, 'RESTでは/users（ユーザー一覧）のようにURLでリソースを表し、HTTPメソッド（GET/POST等）で操作を表します。'),
  q('sysdesign-7',  'sysdesign', 'メッセージキューを使う主な目的はどれか。', ['データを暗号化する', '時間のかかる処理を非同期化し応答速度を上げる', 'APIを自動生成する', 'ログを保存する'], 1, 'メッセージキューはリクエストを即座に処理せず後で処理することで、ピーク時の負荷平準化と応答速度改善ができます。'),
  q('sysdesign-8',  'sysdesign', 'マイクロサービスアーキテクチャの特徴として正しいものはどれか。', ['全機能を1つのプログラムにまとめる', '独立した小さなサービスを組み合わせてシステムを構成する', 'データベースを1つだけ使う', 'デプロイは1度しかできない'], 1, 'マイクロサービスは各機能を独立したサービスに分割します。個別にスケールやデプロイが可能ですが管理が複雑になります。'),
  q('sysdesign-9',  'sysdesign', 'キャッシュのTTL（Time To Live）の役割はどれか。', ['キャッシュのサイズ上限', 'キャッシュデータの有効期限', 'サーバーの稼働時間', 'リクエストのタイムアウト時間'], 1, 'TTLを設定することでキャッシュが古くならないようにします。TTLが切れると次のアクセス時に最新データを取得します。'),
  q('sysdesign-10', 'sysdesign', 'サーキットブレーカーパターンの目的はどれか。', ['サーバーを再起動する', '障害が連鎖（カスケード）しないよう接続を自動的に遮断する', 'データをバックアップする', 'CPUの過熱を防ぐ'], 1, 'あるサービスが障害状態のとき、そこへの接続を一定時間遮断することで他のサービスへの影響波及を防ぎます。'),
  q('sysdesign-11', 'sysdesign', 'SLA（Service Level Agreement）の説明として正しいものはどれか。', ['ソフトウェアの使用許諾契約', 'サービスの品質（可用性・応答時間等）に関する合意', '秘密保持契約', 'サポート料金の契約'], 1, 'SLAは「99.9%の稼働率を保証する」などサービス品質の目標値と補償を定めたものです。'),
  q('sysdesign-12', 'sysdesign', 'APIのページング（ページネーション）を実装する理由はどれか。', ['セキュリティのため', '大量のデータを一度に返さず分割して転送するため', 'APIを保護するため', 'レスポンスを暗号化するため'], 1, '数百万件のデータを一度に返すのは現実的でないため、limit/offsetやcursor方式で分割して返します。'),
  q('sysdesign-13', 'sysdesign', '「ステートレス設計」の説明として正しいものはどれか。', ['サーバーがユーザーの状態を保持する', 'サーバーがリクエストごとに独立して処理し状態を持たない', 'データを永続化しない', 'ログを保存しない'], 1, 'ステートレスなサーバーは水平スケールが容易です。セッション情報は外部ストレージ（Redis等）に保存します。'),
  q('sysdesign-14', 'sysdesign', 'シャーディングの説明として正しいものはどれか。', ['データを暗号化する', 'データベースを複数に分割して負荷を分散する手法', 'バックアップを取る', 'テーブルを結合する'], 1, '膨大なデータを1台のDBで処理しきれない場合、データを分割して複数DBに分散するのがシャーディングです。'),
  q('sysdesign-15', 'sysdesign', 'モノリシックアーキテクチャの特徴はどれか。', ['全機能が1つのアプリケーションとして構成される', '機能ごとに独立したサービスに分かれている', 'データベースが複数ある', 'APIが存在しない'], 0, 'モノリスは初期開発が速くシンプルですが、巨大化すると変更・スケールが困難になります。'),
  q('sysdesign-16', 'sysdesign', 'API Gatewayの役割はどれか。', ['データベースのゲートウェイ', 'クライアントからのリクエストを受け付け各マイクロサービスへルーティングする', 'ファイアウォール', 'CDN'], 1, 'API GatewayはマイクロサービスへのAPIの窓口として、認証・レート制限・ルーティングを一元管理します。'),
  q('sysdesign-17', 'sysdesign', 'フェイルオーバーの説明として正しいものはどれか。', ['システムをアップグレードする', '障害時に自動的にバックアップシステムへ切り替える仕組み', 'ロードバランシングの一種', 'データを復元する'], 1, '自動フェイルオーバーにより、プライマリサーバーが障害を起こしてもスタンバイが引き継ぎ、ダウンタイムを最小化します。'),
  q('sysdesign-18', 'sysdesign', 'Pub/Sub（出版-購読）モデルの説明として正しいものはどれか。', ['1対1のメッセージ送信', 'Publisher（送信者）がメッセージを発行し複数のSubscriber（購読者）が受信する', 'データベースへの一括書き込み', 'APIの同期呼び出し'], 1, 'Pub/SubはKafkaやCloud Pub/Subで実装されます。送信者と受信者を疎結合にして拡張性を高めます。'),
  q('sysdesign-19', 'sysdesign', 'SRE（Site Reliability Engineering）の主な考え方はどれか。', ['開発者がセキュリティを担当する', 'システムは必ず壊れることを前提に信頼性を工学的に向上させる', 'コードを書かずに運用する', 'インフラのコスト削減のみ行う'], 1, 'SREはGoogleが提唱する考え方で、開発と運用を融合しエラーバジェットやSLI/SLOで信頼性を管理します。'),
  q('sysdesign-20', 'sysdesign', 'APIのバージョン管理で一般的な方法はどれか。', ['バージョンを付けない', 'URLにバージョンを含める（例: /v1/users）', 'リクエストボディにバージョンを含める', 'ヘッダーにのみバージョンを含める'], 1, '/v1/、/v2/ のようにURLにバージョンを含めることで、既存クライアントへの影響を与えずにAPIを進化させられます。'),

  q('network-1', 'network', 'TCPがUDPと比べて重視する特徴はどれか。', ['速度だけ', '到達確認と順序制御による信頼性', '暗号化', '名前解決'], 1, 'TCPは確認応答や再送、順序制御によって信頼性を提供します。'),
  q('network-2', 'network', 'ドメイン名をIPアドレスへ変換する仕組みはどれか。', ['DNS', 'DHCP', 'HTTP', 'NAT'], 0, 'DNSが名前解決を行います。'),
  q('network-3', 'network', '別ネットワークへ通信を送る出口はどれか。', ['デフォルトゲートウェイ', 'ループバック', 'MACベンダー', 'Cookie'], 0, '端末はサブネット外への通信をデフォルトゲートウェイへ送ります。'),
  q('linux-1', 'linux', '現在のディレクトリを表示するコマンドはどれか。', ['ls', 'pwd', 'cd', 'mkdir'], 1, 'pwdは現在の作業ディレクトリを表示します。'),
  q('linux-2', 'linux', 'パイプ「|」の役割はどれか。', ['ファイル削除', '前の出力を次へ渡す', '管理者になる', '暗号化'], 1, 'パイプは複数の小さなコマンドを組み合わせます。'),
  q('linux-3', 'linux', '実行権限を表す文字はどれか。', ['r', 'w', 'x', 'e'], 2, 'Linuxの基本権限はr、w、xです。'),
  q('database-1', 'database', 'テーブルの行を一意に識別するものはどれか。', ['外部キー', '主キー', 'ビュー', 'トリガー'], 1, '主キーは各行を一意に識別します。'),
  q('database-2', 'database', '検索結果を並べ替えるSQL句はどれか。', ['GROUP BY', 'ORDER BY', 'WHERE', 'HAVING'], 1, 'ORDER BYに列名とASCまたはDESCを指定します。'),
  q('database-3', 'database', 'トランザクションの変更を確定する命令はどれか。', ['ROLLBACK', 'COMMIT', 'SELECT', 'EXPLAIN'], 1, 'COMMITは変更を確定します。'),
  q('web-1', 'web', 'Webページの意味と構造を担当するものはどれか。', ['HTML', 'CSS', 'SQL', 'DNS'], 0, 'HTMLは文書の意味と構造を表します。'),
  q('web-2', 'web', '既存リソースの取得に通常使うHTTPメソッドはどれか。', ['GET', 'POST', 'DELETE', 'PATCH'], 0, 'GETはリソースの取得に使用します。'),
  q('web-3', 'web', 'JavaScriptからHTML要素を操作するモデルはどれか。', ['DOM', 'DNS', 'ORM', 'CLI'], 0, 'DOMはHTMLをツリー状のオブジェクトとして表します。'),
  ...foundationCourseQuestions,
]

export const skillGlossary = {
  network: terms('network', [['TCP/IP', 'インターネット通信を支えるプロトコル群。'], ['IPアドレス', '機器を識別する論理アドレス。'], ['サブネット', 'IPネットワークを分割した範囲。'], ['DNS', 'ドメイン名とIPアドレスを対応付ける仕組み。'], ['ルータ', '異なるネットワーク間でパケットを転送する機器。'], ['HTTPS', 'TLSで暗号化されたHTTP通信。'], ...foundationGlossaryTerms.network]),
  linux: terms('linux', [['シェル', 'コマンドを解釈してOSへ伝えるプログラム。'], ['ルートディレクトリ', 'ファイルシステムの最上位「/」。'], ['パイプ', '前の出力を次の入力へ渡す仕組み。'], ['パーミッション', '読み取り・書き込み・実行のアクセス権。'], ['プロセス', '実行中のプログラムの単位。'], ['systemd', 'サービス管理システム。'], ...foundationGlossaryTerms.linux]),
  database: terms('database', [['主キー', '行を一意に識別するキー。'], ['外部キー', '別テーブルとの関係を表す列。'], ['SQL', 'リレーショナルDBを操作する言語。'], ['JOIN', '複数テーブルを関連付ける操作。'], ['トランザクション', '一まとまりとして扱う処理単位。'], ['インデックス', '検索を高速化するデータ構造。'], ...foundationGlossaryTerms.database]),
  web: terms('web', [['HTML', 'Web文書の意味と構造を記述する言語。'], ['CSS', '見た目や配置を指定する言語。'], ['DOM', 'HTMLをオブジェクトのツリーとして表すモデル。'], ['HTTP', 'Webの通信プロトコル。'], ['REST API', 'リソースとHTTPメソッドを中心に設計するAPI。'], ['JSON', 'APIで広く使われるテキスト形式。'], ...foundationGlossaryTerms.web]),
  programming: terms('programming', [['変数', 'データを保存する「箱」。'], ['関数', '処理のまとまり。'], ['配列', '順序付きデータの集合。'], ['オブジェクト', 'キーと値のペア。'], ['Promise', '非同期処理の結果を表すオブジェクト。'], ['async/await', '非同期処理を同期的に記述する構文。'], ['クラス', 'オブジェクトの設計図。'], ['スコープ', '変数の有効範囲。'], ['O記法', 'アルゴリズムの計算量を表す記法。'], ['モジュール', 'コードを分割した単位。'], ['単体テスト', '関数やクラスの最小単位のテスト。'], ['デバッグ', 'バグを特定・修正する作業。']]),
  cloud: terms('cloud', [['IaaS', 'インフラを提供するクラウドサービス。'], ['PaaS', 'プラットフォームを提供するクラウドサービス。'], ['SaaS', 'ソフトウェアを提供するクラウドサービス。'], ['Docker', 'コンテナ型仮想化プラットフォーム。'], ['Kubernetes', 'コンテナのオーケストレーションツール。'], ['CI/CD', '継続的インテグレーションとデリバリー。'], ['IaC', 'インフラをコードで管理する手法。'], ['VPC', '仮想的なプライベートネットワーク。'], ['IAM', 'アクセス権限管理。'], ['Lambda', 'AWSのサーバーレス関数。'], ['S3', 'AWSのオブジェクトストレージ。'], ['EC2', 'AWSの仮想サーバー。']]),
  ai: terms('ai', [['機械学習', 'データから学習するAI。'], ['ディープラーニング', '多層ニューラルネットワーク。'], ['教師あり学習', 'ラベル付きデータで学習。'], ['教師なし学習', 'ラベルなしデータで学習。'], ['CNN', '画像処理に特化したNN。'], ['RNN', '時系列データに特化したNN。'], ['Transformer', 'Attention機構を持つNN。'], ['生成AI', '新しいコンテンツを生成するAI。'], ['ハルシネーション', 'もっともらしい誤情報を生成する現象。'], ['ファインチューニング', '学習済みモデルを再学習。'], ['RAG', '外部検索で回答を補完する技術。'], ['XAI', 'AIの判断を説明可能にする分野。']]),
  git: terms('git', [['Git', 'バージョン管理システム。'], ['commit', '変更を記録する操作。'], ['branch', '作業分岐。'], ['merge', '分岐を統合する操作。'], ['Pull Request', '変更を本流へ取り込んでもらう依頼。'], ['.gitignore', 'Git管理から除外するファイル指定。'], ['stash', '変更を一時退避する操作。'], ['clone', 'リモートリポジトリを複製。'], ['push', '変更をリモートへ送信。'], ['pull', 'リモートの変更を取得。'], ['コンフリクト', '変更の衝突。'], ['TDD', 'テスト駆動開発。']]),
  sysdesign: terms('sysdesign', [['スケーラビリティ', '負荷増加への対応能力。'], ['可用性', 'システムが稼働し続ける能力。'], ['SPOF', '単一障害点。'], ['水平スケール', 'サーバー台数を増やす拡張。'], ['垂直スケール', 'サーバー性能を上げる拡張。'], ['マイクロサービス', '独立した小さなサービス。'], ['モノリス', '1つのアプリケーション。'], ['API Gateway', 'APIの入り口。'], ['キャッシュ', '高速化のための一時保存。'], ['Redis', 'インメモリデータストア。'], ['シャーディング', 'DBを複数に分割。'], ['レプリケーション', 'データを複製。']]),
}

function topic(id, title, subtitle, icon, color, description, lessons = 3) {
  return { id, title, subtitle, icon, color, description, level: 'beginner', status: 'available', category: 'skill', path: `/study/${id}`, lessons }
}
function lockedTopic(id, title, icon, description) {
  return { id, title, subtitle: 'Coming Soon', icon, color: '#888', description, level: 'intermediate', status: 'locked', category: 'skill', path: `/study/${id}`, lessons: 0 }
}
function module(id, title, icon, color, lessons) { return { id, title, icon, color, lessons } }
function lesson(id, title, content) { return { id, title, content } }
function q(id, topic, question, choices, answer, explanation) { return { id, topic, level: 'beginner', question, choices, answer, explanation } }
function terms(topic, values) { return values.map(([term, definition], index) => ({ id: `${topic}-${index + 1}`, term, reading: '', definition })) }
