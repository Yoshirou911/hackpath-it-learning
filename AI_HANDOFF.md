# HackPath AI引き継ぎガイド

この文書は、別のAIや開発者が現在の状態から安全に作業を継続するための資料です。

## 2026-08-14 基本情報レッスン図解の引き継ぎ

- 現在バージョンは`v1.3.0`
- `src/components/feLessonVisual.js`の`FE_LESSON_VISUALS`が基本情報36レッスンの図解仕様をレッスンID別に定義する
- 図解形式は`flow`、`layers`、`network`、`compare`、`matrix`、`cycle`の6種類
- `src/pages/study.js`が基本情報の標準レッスンだけに`renderFeLessonVisual()`を挿入し、カスタムノートには挿入しない
- 図中の文字精度、レスポンシブ表示、保守性を優先してCSS図解を使用し、外部画像やインラインSVGへ依存しない
- レッスンを追加・削除した場合は同じIDの図解仕様も増減し、`tests/fe-lesson-visuals.test.mjs`の全レッスン網羅テストを維持する
- 各図はタイトル、20文字以上の説明、3個以上の固有ノード、図の読み方、`role=img`の代替説明を持つ

## 2026-08-14 理解度コアの引き継ぎ

- 現在バージョンは`v1.2.0`
- `src/components/feMasteryCore.js`が基本情報140問を8分野×3レベルへ分類し、理解度計算・表示・分野切替を担当する
- レベル分類は`beginner=bronze`、`intermediate=silver`、`advanced=gold`。クイズ画面と同様に`difficulty`も後方互換で参照する
- 理解度は`正答率×0.6 + 回答網羅率×0.4`。試験合格率ではなくHackPath独自の学習指標として扱う
- 問題回答履歴`state.quiz.answered`だけから都度導出するため、新しい保存フィールドや移行処理はない
- 基本情報の既存数値ID問題はID・問題文から分野を補完し、追加問題は`category`と`bDomain`から分類する
- 分野追加・カテゴリ変更時は`FE_MASTERY_DOMAINS`と`getFeMasteryDomainId()`を更新し、140問すべてが有効な分野へ入るテストを維持する
- `tests/fe-mastery-core.test.mjs`が全問題の分類、理解度計算式、8分野・3レベル・演習導線を検証する

## 2026-08-14 基本情報 合格力強化の引き継ぎ

- 現在バージョンは`v1.1.0`
- `src/data/feIntensiveCourse.js`の科目B問題は40問。`bDomain`で`algorithm`32問、`security`8問に分類する
- `src/data/feMockExam.js`が科目A模試1セットと科目B模試2セットの出題ID・問題数・制限時間を定義する
- 科目B模試は各20問で、必ずアルゴリズム・プログラミング16問＋情報セキュリティ4問にする。2セット間で問題IDは重複させない
- 模試URLは`#/quiz/fe/mock-a/all`、`#/quiz/fe/mock-b-1/all`、`#/quiz/fe/mock-b-2/all`
- 模試回答も通常演習と同じ`recordQuizAnswer()`を使うため、既存の進捗保存・クラウド同期・XP重複防止が働く
- タイマーは画面内セッション用で、再読込時に最初から始まる。進捗データ形式には追加していない
- 基本情報コースは36教材・140問・100用語。全体は369教材・691問・481用語
- `tests/fe-intensive-course.test.mjs`が収録数、科目Bの32:8比率、模試ごとの16:4構成、セット間重複を検証する
- 合格力チェックの科目A 75%・科目B 80%はHackPath独自の学習目標。IPAの評価点600点と同一視しない

## バージョン更新の引き継ぎ

- 現在バージョンは`src/data/releases.js`の`releaseHistory[0].version`から取得し、`currentVersion`として画面へ表示する
- `package.json`と`package-lock.json`のルートバージョンを、`currentVersion`と必ず一致させる
- 新しい公開更新では`releaseHistory`の先頭へ、`version`・`date`・`title`・`summary`・`highlights`・`sections`を追加する
- `src/pages/updates.js`が`#/updates`の更新履歴画面を描画し、左メニューとサイドバー下部から開ける
- 更新種別は`feature`（追加）、`improvement`（改善）、`fix`（修正）を使用する
- `tests/release-history.test.mjs`がバージョン一致、重複、変更内容、ナビゲーションを検証する
- バージョン表示は学習進捗データと分離されており、localStorageとクラウド保存形式へ影響しない

## 2026-08-14 操作不具合修正の引き継ぎ

- `src/pages/quiz.js`のフィルター変更は`getQuizPath()`から`navigate()`を呼び、ルーター経由で全レイアウトを再描画する。`#app`へクイズ本文だけを直接代入しない
- 全分野のフィルターURLでは`all`をトピックのURL値として使い、表示時に空のトピックへ戻す
- 効果音ボタンは`.mode-tab-btn`の見た目を共有するが`data-mode`を持たない。復習モードのイベント対象は必ず`[data-mode]`に限定する
- 基本情報以外へ分野を変更するときは、科目A・Bモードを`all`へ戻す
- クイズ選択肢は`radiogroup`・`radio`としてEnter/Space操作に対応し、問題が0件のランクは無効化する
- `src/pages/editor.js`のコース選択肢は`roadmapTopics`から自動生成する。保存・編集・削除後は`rerenderEditor()`で`.page-content`だけを更新する
- 保存形式とlocalStorageキーは変更していない
- `tests/interaction-regressions.test.mjs`がフィルターURL、選択肢アクセシビリティ、ノート追加先の全コース同期を検証する

## 2026-08-14 ナビゲーション再編の引き継ぎ

- `src/components/layout.js`の`sidebarNavGroups`が`roadmapTopics`の`category`から資格対策とITスキルを自動分類する
- 利用可能な新コースを追加すると、左メニューにも自動追加される。資格は`category: 'certification'`、実務分野は`category: 'skill'`を維持する
- 左メニューは`details`要素で開閉し、現在のコースを含むグループだけ自動展開する
- ロードマップ見出しは`.roadmap-rank-header`専用グリッドで制御し、1180px以下は2列、760px以下は1列になる
- `tests/sidebar-navigation.test.mjs`が利用可能な全資格・ITスキルの収録と重複を検証する

## 2026-08-14 基本情報徹底強化の引き継ぎ

- `src/data/feIntensiveCourse.js`: 基本情報の追加26教材、科目A 66問、科目B 40問、追加72用語、現行試験仕様を一括定義
- 既存データへは`content.js`、`questions.js`、`glossary.js`から追加配列を結合しているため、旧ID・旧進捗は維持される
- 基本情報の合計は36教材・140問・100用語。全体は369教材・691問・481用語
- 科目別演習モードは`#/quiz/fe/section-a/all`と`#/quiz/fe/section-b/all`。本番形式模試は`src/data/feMockExam.js`の3モードを使う
- 既存の基本情報問題には`examSection`がないため、UI上は後方互換として科目A扱いにする
- `tests/fe-intensive-course.test.mjs`が収録数、試験仕様、4択構造、科目B擬似言語を検証する
- IPA公開シラバスの範囲を基準にした独自教材であり、試験問題の転載ではない。シラバス改訂時は`feExamBlueprint`と教材範囲を再確認する

## プロダクト方針

HackPathは、資格暗記だけでなく「解説 → 確認問題 → 用語復習 → 学習履歴」の流れで幅広いIT知識を学べるソフトを目指しています。初心者向けの分かりやすさ、実務につながる説明、安全・倫理への配慮を優先してください。

## 技術構成

- Vite
- Vanilla JavaScript（ES Modules）
- CSS
- hashベースのクライアントルーティング
- Cloudflare Worker + D1（ユーザー別のクラウド進捗保存）
- SitesのSign in with ChatGPT（SIWC）認証
- localStorageキー: `hackpath-progress`（オフライン用キャッシュ）、`hackpath-progress-owner`（キャッシュ所有者）

## 重要ファイル

- `src/data/topics.js`: 全コースのメタデータを統合
- `src/data/content.js`: 全学習モジュールを統合
- `src/data/questions.js`: 全クイズを統合
- `src/data/glossary.js`: 全用語を統合
- `src/data/skillCourses.js`: 新しい実務スキル系コースの定義
- `src/data/skillCourseBreadthExpansion.js`: データ分析・モバイル・IoT・SRE・UX・ITガバナンスの追加6コース
- `src/data/certificationExpansion.js`: 追加9資格のコース、教材、独自確認問題、用語を一括定義
- `src/data/certificationPyramid.js`: 資格スキルピラミッドの7段ランクと資格コース配置
- `src/data/certificationDifficulty.js`: 実在資格12件の難易度推定、採点内訳、公式区分と参照先
- `src/data/eliteCourse.js`: 最初から閲覧・挑戦できる最高難度`SOVEREIGN LAB`の教材・問題・用語
- `src/data/foundationCourseExpansion.js`: ネットワーク・Linux・DB・Webの深掘りレッスン、問題、用語
- `src/data/stackCourse.js`: `it-study-app`から読み取り専用で移植したIT総合教本83本と科目A/B問題99問の変換・統合
- `src/data/stack/`: 移植元の教材・問題JSONのリポジトリ内スナップショット（外部フォルダーへ実行時依存しない）
- `src/data/ranks.js`: ランク定義、XPランク判定、レッスンの3段階配分
- `src/components/rank.js`: ランクバッジとエンブレムの共通描画
- `src/components/effects.js`: 正誤・クリア効果音、ミッションクリア・ランク昇格演出、端末別サウンド設定
- `src/data/achievements.js`: 回答履歴・XPから導出する実績バッジ定義
- `src/data/releases.js`: 現在バージョンと公開アップデート履歴
- `src/components/lessonExplainer.js`: 短い教材へ分野説明と用語の意味・必要性・理解チェックを補う共通描画
- `src/store.js`: XP、回答、進捗、履歴のlocalStorage保存・クラウド同期・旧データ移行
- `src/router.js`: ルーティング
- `src/pages/`: 各画面
- `src/pages/updates.js`: バージョン別の追加・改善・修正内容を表示する更新履歴画面
- `src/pages/editor.js`: 端末内に保存する個人ノートの追加・編集と、安全なマークダウン描画
- `PROGRESS.md`: 現在の実装数と次タスク
- `HackPathを開く.cmd`: Windows用ワンクリック起動ランチャー（固定ポート5190）
- `worker/index.js`: 公開環境の静的配信、認証済みユーザーAPI、D1進捗保存、セキュリティヘッダー
- `db/schema.ts`: D1の`user_progress`テーブル定義
- `drizzle/`: Sites公開時に適用するD1マイグレーション
- `vite.config.js` / `wrangler.jsonc`: Sites向けCloudflare Worker・静的アセット設定
- `scripts/prepare-sites-build.mjs`: ViteのWorker出力をSites用`dist/server/index.js`へ配置
- `public/_headers`: 静的アセットへ適用する公開環境のセキュリティヘッダー
- `index.html`: 公開基盤の配信方法に左右されないブラウザ強制CSP

## コース追加手順

実務スキル系コースは原則として`src/data/skillCourses.js`へ追加します。
基盤4分野の教材を拡張する場合は、見通しを保つため`src/data/foundationCourseExpansion.js`へ追加し、`skillCourses.js`から統合します。
追加6分野の内容を拡張する場合は`src/data/skillCourseBreadthExpansion.js`を更新し、`skillCourses.js`の統合を維持します。
資格対策コースは`src/data/certificationExpansion.js`へ追加し、公式の公開試験範囲を参照しながらも、問題文は転載せず独自に作成します。各教材には非公式教材であることと、最新範囲は主催者の公式情報で確認する旨を残してください。

1. `skillCourseTopics`へトピック情報を追加
2. 同じIDで`skillCourseModules`へレッスンを追加
3. `skillQuestions`へ確認問題を追加
4. `skillGlossary`へ用語を追加
5. 必要なら`src/store.js`の`DEFAULT_STATE.topics`へ初期値を追加
6. `npm.cmd run build`とデータ件数チェックを実行
7. `PROGRESS.md`を更新

トピックIDは英小文字の短い名前にし、レッスンIDは`<topic>-l<number>`、クイズIDは既存の数値IDと衝突しない文字列を使います。

深掘り教材は「要点 → 身近なたとえ → 図解 → 仕組みの説明 → 実践課題 → よくある失敗」の順を基本にします。既存の`concept-diagram`、`concept-callout`、`practice-card`、`pitfall-card`を再利用すると、スマートフォンを含め同じ見た目を保てます。
短い既存教材は`renderExplainedLesson()`が表示時に理解ガイドと用語説明カードを補います。`lesson-lead`を持つ深掘り済み教材と`isCustom`の個人ノートはそのまま表示します。新しい短い教材の用語は`<li><strong>用語</strong> — 概要</li>`形式にすると説明カードへ変換されます。

## データ契約

```js
// topic
{ id, title, subtitle, icon, level, status, category, path, color, lessons, description }

// module
{ id, title, icon, color, lessons: [{ id, title, content }] }

// question
{ id, topic, level, question, choices, answer, explanation }

// 科目Bの入力問題（追加フィールド）
{ id, topic, category, level, question, pseudocode, inputType: 'text', expectedAnswer, explanation }

// glossary term
{ id, term, reading, definition }
```

`topic.lessons`と`module.lessons.length`は必ず一致させてください。クイズの`answer`は0始まりの選択肢インデックスです。

## 保存データの互換性

既存ユーザーのlocalStorageを壊さないことが重要です。保存形式を変更するときは、新旧形式を読める移行処理を用意してください。現在はレッスン完了の重複を防ぐため`completedLessonIds`を段階的に追加しています。過去データにはこの配列がない場合があるため、`??=`による補完を残しています。

ログイン済みユーザーの進捗は、SIWCからWorkerへ渡されるメールアドレスをキーにD1へ保存します。`GET /api/me`でログイン状態、`GET /api/progress`で本人の進捗を取得し、`PUT /api/progress`で本人の進捗だけを更新します。未ログイン時は従来どおりlocalStorageだけで利用できます。所有者情報がない旧localStorageは最初にログインしたアカウントへ一度だけ移行し、所有者が異なるキャッシュは別ユーザーへ送信しません。ログアウト時は端末キャッシュを消去します。

同一アカウントでは、再読込直前に端末へ保存された回答と取得したクラウド回答を統合し、正解を優先して保持します。`pagehide`でもkeepalive付き保存を開始するため、更新直後の進捗取りこぼしを抑えています。異なるアカウント間では統合しません。

D1の保存形式は既存の状態オブジェクトを`state_json`へ格納する方式です。Worker側でも件数・文字数・XP範囲を検証しています。スキーマ変更時は`db/schema.ts`を編集し、`npm.cmd run db:generate`後に生成SQLを必ず確認してください。

## ランクシステム

- ブロンズは基礎、シルバーは応用、ゴールドは上級に対応する。
- `getStageLayout()`がコース内レッスンをおおむね4:3:3で自動配分する。3レッスンの実務コースは1:1:1になる。
- ブロンズ・シルバー・ゴールドのレッスンは最初からすべて閲覧できる。ランクによる閲覧ロックは設けない。
- コースランクと進捗率は、そのコースのクイズ正解数から導出する。資格コースの数値ID問題と実務コースの文字列ID問題の両方に対応している。
- コース内の難易度は`learningRanks`のブロンズ・シルバー・ゴールド3段階を維持する。
- アカウントランクは`accountRanks`からXPで導出する。基準はブロンズ0、シルバー300、ゴールド700、プラチナ1100、ダイヤモンド1600、マスター2100、ソヴリン3200。
- XPは問題回答だけで獲得する。初回正解は10 XP、初回不正解は2 XP、不正解後に正解すると不足分の8 XPを獲得する。同じ問題で合計10 XPを超えて獲得できない。
- レッスン閲覧・レッスン完了記録・用語カード確認ではXPを付与しない。既存の回答・進捗保存形式は維持している。
- ランク紋章はゲームの階級章に着想を得た独自CSS表現で、第三者ゲームのロゴや画像素材を使用しない。
- 実績は保存形式を増やさず、同期済みの回答履歴とXPから都度導出する。過去ユーザーにも自動適用される。
- 効果音設定は端末ローカルの`hackpath-sound-enabled`に保存し、ユーザー進捗とは分離する。
- 全ランク紋章はダッシュボードで未到達分もプレビューできる。ランクは称号・進捗表示であり、教材や問題をロックしない。
- ロードマップの資格スキルピラミッドはHackPath独自の学習目安であり、公式な資格序列ではない。資格を増減した場合は`certificationPyramid.js`も更新し、全資格が重複なく配置されるテストを維持する。
- 資格難易度ランキングもHackPath独自推定。公式区分を基礎資料に、`certificationDifficulty.js`の5項目・100点ルーブリックを使用する。変動の大きい合格率や学習時間を根拠なく固定値として追加しない。
- 問題の階級フィルターは`level`と`difficulty`からブロンズ・シルバー・ゴールド・SOVEREIGNへ分類する。`elite`または難易度7以上はSOVEREIGN扱い。

## 現在の注意点

- レッスンHTMLは信頼済みのローカルデータを直接描画している。ユーザー入力を同じ方法で描画しないこと。
- 追加ノートは`hackpath-custom-lessons`へ端末内保存する。`renderContent()`で必ずHTMLエスケープしてから限定的なマークダウンを変換しており、生HTMLを許可しない。
- `getTopicProgress`は参照時にlocalStorageも更新するため、将来は読み取りと保存を分離する余地がある。
- 成績は全コース合算。問題画面には全問題・苦手優先・未回答・不正解の切り替えと、カテゴリ情報を持つ問題の分野別理解度がある。日別の推移グラフは未実装。
- `stack`コースのデータは`it-study-app`から移植したスナップショットであり、元フォルダーを直接参照・変更しない。更新時も元データを読み取り専用で確認し、JSONを検証してからこのリポジトリ側だけを更新する。
- `npm.cmd test`で保存データの分離・移行、XPルール、教材数、ID重複、深掘り教材の構成、短い教材の説明変換を確認できる。ほかの画面は最低限ビルドとデータ整合性を確認すること。
- 資格の試験範囲・名称・バージョンは変更される可能性がある。`certificationExpansion.js`を更新するときは、IPA、AWS、Cisco、LPI-Japanなど主催者の最新公式情報を確認すること。
- `npm`はPowerShellの実行ポリシーにより失敗する環境があるため、Windowsでは`npm.cmd`を使用する。
- 日常利用では`HackPathを開く.cmd`をダブルクリックすると、固定URL `http://localhost:5190/` が既定ブラウザで開く。
- 公開WorkerのCSP・権限制限・クリックジャッキング防止ヘッダーを弱める場合は、必要性と影響を確認する。

## 推奨する次の実装

次は、履歴を日別に集計する成績グラフ、間隔反復（最終回答日時・連続正解を考慮）、SQLやJavaScriptを安全に試せるブラウザ演習、コース検索と難易度フィルターの順で検討してください。

## 完了条件

- `npm.cmd run build`が成功
- 追加コースがロードマップ、ダッシュボード、学習、クイズ、用語集で開ける
- 既存4資格コースが引き続き開ける
- すべての難易度のレッスンを最初から閲覧できる
- レッスン閲覧と用語確認ではXPが増えず、問題回答だけでXPが増える
- 同じ問題への再回答でXPを重複獲得できない
- `PROGRESS.md`の件数と実データが一致する
