export const FE_LESSON_VISUALS = {
  'fe-l1': visual('flow', 'アルゴリズムは「変換の手順」', '入力を決められた手順で処理し、正しい出力へ変換します。', ['入力データ', '処理手順', '出力結果', '効率を評価']),
  'fe-l2': visual('layers', 'OSはアプリと機械の仲介役', 'アプリからの要求を受け、CPU・メモリ・装置を安全に割り当てます。', ['アプリケーション', 'システムコール', 'OS・資源管理', 'ハードウェア']),
  'fe-l3': visual('network', '通信は層ごとに役割を分担', 'データは送信側で包まれ、ネットワークを通り、受信側で元に戻ります。', ['アプリのデータ', 'TCP / UDP', 'IP・ルーティング', '相手へ到着']),
  'fe-l4': visual('flow', 'データベースが検索へ答える流れ', 'SQLをDBMSが解釈し、保存されたデータから必要な結果を返します。', ['SQL要求', 'DBMSが解析', '表・索引を検索', '結果を返す']),
  'fe-l5': visual('flow', 'プログラムが実行されるまで', '人が書いたソースコードは翻訳・実行環境を通ってCPUの処理になります。', ['ソースコード', '翻訳・実行環境', '機械命令', '処理結果']),
  'fe-l6': visual('compare', 'コンパイラとインタプリタ', '実行前にまとめて翻訳する方式と、実行しながら逐次解釈する方式を比較します。', ['コンパイラ｜全体を翻訳してから実行', 'インタプリタ｜1文ずつ解釈して実行', '共通点｜ソースを処理へ変換']),
  'fe-l7': visual('matrix', '用途で選ぶ4つのデータ構造', '追加・削除・探索の方法に合わせて、データの持ち方を選びます。', ['配列｜添字で参照', 'リスト｜リンクで接続', 'スタック｜後入れ先出し', 'キュー｜先入れ先出し']),
  'fe-l8': visual('compare', 'データ量nと処理時間の増え方', '同じ答えでも、入力が増えたときの処理回数によって実用性が変わります。', ['O(1)｜ほぼ一定', 'O(log n)｜緩やかに増加', 'O(n)｜入力に比例', 'O(n²)｜急激に増加']),
  'fe-l9': visual('flow', 'コンピュータ内部のデータ移動', '入力されたデータをCPUが主記憶から読み、演算して出力装置へ渡します。', ['入力装置', '主記憶', 'CPUで演算', '出力・保存']),
  'fe-l10': visual('flow', '情報を届けるための符号化', '情報をビット列へ変換し、誤りや圧縮を考慮して伝送・復元します。', ['元の情報', '符号化', '伝送・保存', '復号して利用']),
  'fe-intensive-l01': visual('cycle', 'CBT攻略の学習ループ', '理解と演習を往復し、最後に本番時間で再現できるか確認します。', ['教材で理解', '問題を解く', '根拠を復習', '模試で確認']),
  'fe-intensive-l02': visual('flow', '論理式を結果へ変える', '入力の真偽を演算規則に通し、真理値表で全パターンを確認します。', ['入力 A・B', 'AND / OR / NOT', '論理式を整理', '真理値表で検証']),
  'fe-intensive-l03': visual('flow', 'CPUの命令サイクル', '命令を取り出し、意味を解読し、演算して結果を記録します。', ['フェッチ', 'デコード', '実行', '結果を書戻し']),
  'fe-intensive-l04': visual('layers', '速さと容量の記憶階層', 'CPUに近いほど高速・小容量、遠いほど低速・大容量になります。', ['レジスタ｜最速', 'キャッシュ', '主記憶', '補助記憶｜大容量']),
  'fe-intensive-l05': visual('flow', '入出力と信頼性をつなぐ', '装置への読み書きだけでなく、冗長化とバックアップで故障時の影響を抑えます。', ['入出力要求', '装置制御', 'ストレージ', '冗長化・復旧']),
  'fe-intensive-l06': visual('cycle', 'プロセスの状態遷移', '実行可能な処理を待ち行列からCPUへ割り当て、待機と実行を切り替えます。', ['実行可能', 'CPUで実行', '入出力待ち', '待ち解除']),
  'fe-intensive-l07': visual('flow', '共有資源を安全に使う', 'ロックを取得した処理だけがクリティカルセクションへ入り、終了後に解放します。', ['資源を要求', 'ロック取得', '排他区間を実行', 'ロック解放']),
  'fe-intensive-l08': visual('layers', '仮想化技術の積み重なり', '物理資源を分割・隔離し、複数の実行環境から共用します。', ['アプリケーション', 'コンテナ / VM', 'OS / ハイパーバイザ', '物理ハードウェア']),
  'fe-intensive-l09': visual('network', 'IPアドレスから経路を決める', 'アドレスとサブネットマスクで所属ネットワークを判定し、必要ならルータへ渡します。', ['IPアドレス', 'ネットワーク部を判定', 'ルーティング表', '宛先ネットワーク']),
  'fe-intensive-l10': visual('layers', '主要プロトコルの役割', 'アプリ、転送、経路、伝送の各層が別々の責任を持ちます。', ['HTTP / DNS', 'TCP / UDP', 'IP', 'LAN・物理通信']),
  'fe-intensive-l11': visual('flow', 'リスクから防御を設計する', '守る資産と脅威・脆弱性を整理し、複数の対策を重ねます。', ['情報資産', '脅威を特定', '脆弱性を評価', '多層防御']),
  'fe-intensive-l12': visual('network', '暗号・署名・証明書の連携', '暗号化で秘密を守り、署名と証明書で改ざん・なりすましを確認します。', ['送信者', '暗号化・署名', '安全でない通信路', '復号・検証']),
  'fe-intensive-l13': visual('flow', '正規化でデータを整理する', '繰返しや部分従属を分解し、更新時の矛盾を起こしにくい表へ変えます。', ['未正規形', '第1正規形', '第2正規形', '第3正規形']),
  'fe-intensive-l14': visual('flow', 'SQLを論理的な処理順で読む', '表を結合・絞込み・集約してから、必要な列と並び順を決めます。', ['FROM・JOIN', 'WHERE', 'GROUP・HAVING', 'SELECT・ORDER']),
  'fe-intensive-l15': visual('cycle', 'トランザクションと障害回復', '一連の更新を確定するか取り消し、ログから整合した状態へ戻します。', ['BEGIN', 'データを更新', 'COMMIT / ROLLBACK', 'UNDO / REDO']),
  'fe-intensive-l16': visual('flow', '要求を設計へ落とし込む', '利用者の目的を要件へ変換し、UMLなどで構造と振舞いを具体化します。', ['利用者の課題', '要件定義', 'UMLでモデル化', '設計へ変換']),
  'fe-intensive-l17': visual('cycle', '品質を作り込むテスト工程', '要求から観点とケースを作り、実行結果をレビューして改善します。', ['要求を確認', 'テスト設計', '実行・記録', 'レビュー・改善']),
  'fe-intensive-l18': visual('compare', 'EVMの3つの値を比較する', '計画・成果・実コストの差から、進捗と費用のずれを判断します。', ['PV｜計画した価値', 'EV｜完了した価値', 'AC｜実際の費用']),
  'fe-intensive-l19': visual('cycle', 'サービスを継続改善する', '合意した水準を監視し、障害へ対応して再発防止へつなげます。', ['SLAを合意', '監視・測定', 'インシデント対応', '改善・再発防止']),
  'fe-intensive-l20': visual('flow', '経営目標からIT施策へ', '外部・内部環境を分析し、業務プロセスとシステム投資を結び付けます。', ['環境分析', '経営目標', '業務を改善', 'IT戦略・施策']),
  'fe-intensive-l21': visual('flow', '売上から利益を求める', '売上から変動費を引いた限界利益で固定費を回収し、残りが利益になります。', ['売上高', '変動費を控除', '限界利益', '固定費・利益']),
  'fe-intensive-l22': visual('flow', '知的財産を正しく利用する', '創作物や発明の権利を確認し、契約・ライセンス条件に沿って利用します。', ['成果物を作る', '権利を確認', '許諾・契約', '条件内で利用']),
  'fe-intensive-l23': visual('flow', 'データから予測モデルを作る', '目的に合うデータを整え、学習・評価を経て未知データへ適用します。', ['データ収集・前処理', 'モデルを学習', '性能を評価', '予測・改善']),
  'fe-intensive-l24': visual('flow', '擬似言語は変数の変化を追う', '型と初期値を確認し、条件が真か偽かを1行ずつ記録します。', ['型・初期値', '代入を実行', '条件を判定', '変数表を更新']),
  'fe-intensive-l25': visual('flow', '配列探索をトレースする', '添字と探索範囲を記録し、比較回数から計算量まで判断します。', ['配列と添字', '探索範囲', '値を比較', '結果・計算量']),
  'fe-intensive-l26': visual('matrix', '問題に合う処理構造を選ぶ', '整列・スタック・再帰・グラフは、状態と処理順を図にすると追跡しやすくなります。', ['整列｜比較と交換', 'スタック｜LIFO', '再帰｜呼出しを積む', 'グラフ｜訪問済み管理']),
}

export function renderFeLessonArtwork(lessonId) {
  const spec = FE_LESSON_VISUALS[lessonId]
  if (!spec) return ''
  return `
    <figure class="fe-lesson-artwork" aria-labelledby="fe-artwork-title-${lessonId}">
      <div class="fe-artwork-image-shell">
        <img src="/images/fe-lessons/${lessonId}.webp" width="401" height="401" loading="lazy" decoding="async" alt="${escapeHtml(`${spec.title}をイメージした教材イラスト`)}">
        <span>LESSON ARTWORK</span>
      </div>
      <figcaption>
        <span class="eyebrow">IMAGINE THE SYSTEM</span>
        <h2 id="fe-artwork-title-${lessonId}">${escapeHtml(spec.title)}</h2>
        <p>${escapeHtml(spec.caption)}</p>
        <small>最初に全体像をイメージし、次の図解で処理の順番と用語を確認しましょう。</small>
      </figcaption>
    </figure>
  `
}

function visual(type, title, caption, items) {
  return { type, title, caption, items }
}

export function renderFeLessonVisual(lessonId) {
  const spec = FE_LESSON_VISUALS[lessonId]
  if (!spec) return ''
  return `
    <figure class="fe-lesson-visual fe-visual-${spec.type}" aria-labelledby="fe-visual-title-${lessonId}">
      <figcaption>
        <span class="eyebrow">VISUAL OVERVIEW</span>
        <h2 id="fe-visual-title-${lessonId}">${escapeHtml(spec.title)}</h2>
        <p>${escapeHtml(spec.caption)}</p>
      </figcaption>
      <div class="fe-visual-canvas" role="img" aria-label="${escapeHtml(`${spec.title}。${spec.items.join('、')}`)}">
        ${spec.items.map((item, index) => {
          const [heading, detail] = item.split('｜')
          return `<div class="fe-visual-node"><b>${String(index + 1).padStart(2, '0')}</b><strong>${escapeHtml(heading)}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</div>`
        }).join('')}
      </div>
      <p class="fe-visual-reading"><b>図の読み方</b>${escapeHtml(makeReading(spec.type))}</p>
    </figure>
  `
}

function makeReading(type) {
  if (type === 'layers') return '上から下へ、利用者に近い層から機械・基盤に近い層へたどります。'
  if (type === 'compare') return '各項目の役割と違いを横に比較し、使い分ける条件を確認します。'
  if (type === 'matrix') return '4つの選択肢を並べ、データの持ち方や処理順の違いを比較します。'
  if (type === 'cycle') return '最後の処理が最初へ戻る循環として、継続的な状態変化を追います。'
  if (type === 'network') return '左から右へデータを追い、各地点で何が付加・確認されるかを見ます。'
  return '左から右へ処理を追い、それぞれの段階で入力がどう変化するかを確認します。'
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
