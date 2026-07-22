// 実務スキル系コース。topic / module / questions / glossary は同じIDで揃える。
// 資格系データと分離し、コース単位で追加・差し替えしやすくしている。

export const skillCourseTopics = [
  topic('network', 'ネットワーク基礎', '通信の流れを図解で理解する', '🌐', '#20c997', 'TCP/IP、IPアドレス、DNS、HTTPと障害調査の基本'),
  topic('linux', 'Linux・OS', 'コマンド操作とOSの仕組み', '🐧', '#f5b700', 'ファイル操作、権限、プロセス、ログの読み方'),
  topic('database', 'データベース・SQL', 'データを正しく設計して扱う', '🗄️', '#4dabf7', 'SQL、テーブル設計、正規化、トランザクション'),
  topic('web', 'Web開発・API', 'Webアプリが動く仕組みを学ぶ', '🕸️', '#ff6b9d', 'HTML/CSS/JavaScript、HTTP、REST API、ブラウザ'),
  lockedTopic('programming', 'プログラミング', '⌨️', '変数、制御構文、関数、オブジェクト指向'),
  lockedTopic('cloud', 'クラウド・DevOps', '☁️', 'AWS/Azure/GCP、Docker、CI/CD、監視'),
  lockedTopic('ai', 'AI・機械学習', '🤖', '機械学習、生成AI、データ活用の基礎'),
]

export const skillCourseModules = {
  network: module('network', 'ネットワーク基礎', '🌐', '#20c997', [
    lesson('network-l1', 'ネットワークとTCP/IP', `
      <h3>データは層に分かれて運ばれる</h3>
      <p>インターネットでは、役割ごとに通信を分ける<strong>TCP/IPモデル</strong>が使われます。</p>
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
  ]),
  database: module('database', 'データベース・SQL', '🗄️', '#4dabf7', [
    lesson('database-l1', 'リレーショナルDBの基本', `
      <h3>表の関係でデータを表す</h3>
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
  ]),
  web: module('web', 'Web開発・API', '🕸️', '#ff6b9d', [
    lesson('web-l1', 'HTML・CSS・JavaScript', `
      <h3>Webページを構成する3技術</h3>
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
  ]),
}

export const skillQuestions = [
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
]

export const skillGlossary = {
  network: terms('network', [['TCP/IP', 'インターネット通信を支えるプロトコル群。'], ['IPアドレス', '機器を識別する論理アドレス。'], ['サブネット', 'IPネットワークを分割した範囲。'], ['DNS', 'ドメイン名とIPアドレスを対応付ける仕組み。'], ['ルータ', '異なるネットワーク間でパケットを転送する機器。'], ['HTTPS', 'TLSで暗号化されたHTTP通信。']]),
  linux: terms('linux', [['シェル', 'コマンドを解釈してOSへ伝えるプログラム。'], ['ルートディレクトリ', 'ファイルシステムの最上位「/」。'], ['パイプ', '前の出力を次の入力へ渡す仕組み。'], ['パーミッション', '読み取り・書き込み・実行のアクセス権。'], ['プロセス', '実行中のプログラムの単位。'], ['systemd', 'サービス管理システム。']]),
  database: terms('database', [['主キー', '行を一意に識別するキー。'], ['外部キー', '別テーブルとの関係を表す列。'], ['SQL', 'リレーショナルDBを操作する言語。'], ['JOIN', '複数テーブルを関連付ける操作。'], ['トランザクション', '一まとまりとして扱う処理単位。'], ['インデックス', '検索を高速化するデータ構造。']]),
  web: terms('web', [['HTML', 'Web文書の意味と構造を記述する言語。'], ['CSS', '見た目や配置を指定する言語。'], ['DOM', 'HTMLをオブジェクトのツリーとして表すモデル。'], ['HTTP', 'Webの通信プロトコル。'], ['REST API', 'リソースとHTTPメソッドを中心に設計するAPI。'], ['JSON', 'APIで広く使われるテキスト形式。']]),
}

function topic(id, title, subtitle, icon, color, description) {
  return { id, title, subtitle, icon, color, description, level: 'beginner', status: 'available', category: 'skill', path: `/study/${id}`, lessons: 3 }
}
function lockedTopic(id, title, icon, description) {
  return { id, title, subtitle: 'Coming Soon', icon, color: '#888', description, level: 'intermediate', status: 'locked', category: 'skill', path: `/study/${id}`, lessons: 0 }
}
function module(id, title, icon, color, lessons) { return { id, title, icon, color, lessons } }
function lesson(id, title, content) { return { id, title, content } }
function q(id, topic, question, choices, answer, explanation) { return { id, topic, level: 'beginner', question, choices, answer, explanation } }
function terms(topic, values) { return values.map(([term, definition], index) => ({ id: `${topic}-${index + 1}`, term, reading: '', definition })) }
