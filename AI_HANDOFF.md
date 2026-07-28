# HackPath AI引き継ぎガイド

この文書は、別のAIや開発者が現在の状態から安全に作業を継続するための資料です。

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
- `src/data/foundationCourseExpansion.js`: ネットワーク・Linux・DB・Webの深掘りレッスン、問題、用語
- `src/data/ranks.js`: ランク定義、XPランク判定、レッスンの3段階配分
- `src/components/rank.js`: ランクバッジとエンブレムの共通描画
- `src/components/lessonExplainer.js`: 短い教材へ分野説明と用語の意味・必要性・理解チェックを補う共通描画
- `src/store.js`: XP、回答、進捗、履歴のlocalStorage保存・クラウド同期・旧データ移行
- `src/router.js`: ルーティング
- `src/pages/`: 各画面
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

// glossary term
{ id, term, reading, definition }
```

`topic.lessons`と`module.lessons.length`は必ず一致させてください。クイズの`answer`は0始まりの選択肢インデックスです。

## 保存データの互換性

既存ユーザーのlocalStorageを壊さないことが重要です。保存形式を変更するときは、新旧形式を読める移行処理を用意してください。現在はレッスン完了の重複を防ぐため`completedLessonIds`を段階的に追加しています。過去データにはこの配列がない場合があるため、`??=`による補完を残しています。

ログイン済みユーザーの進捗は、SIWCからWorkerへ渡されるメールアドレスをキーにD1へ保存します。`GET /api/me`でログイン状態、`GET /api/progress`で本人の進捗を取得し、`PUT /api/progress`で本人の進捗だけを更新します。未ログイン時は従来どおりlocalStorageだけで利用できます。所有者情報がない旧localStorageは最初にログインしたアカウントへ一度だけ移行し、所有者が異なるキャッシュは別ユーザーへ送信しません。ログアウト時は端末キャッシュを消去します。

D1の保存形式は既存の状態オブジェクトを`state_json`へ格納する方式です。Worker側でも件数・文字数・XP範囲を検証しています。スキーマ変更時は`db/schema.ts`を編集し、`npm.cmd run db:generate`後に生成SQLを必ず確認してください。

## ランクシステム

- ブロンズは基礎、シルバーは応用、ゴールドは上級に対応する。
- `getStageLayout()`がコース内レッスンをおおむね4:3:3で自動配分する。3レッスンの実務コースは1:1:1になる。
- ブロンズ・シルバー・ゴールドのレッスンは最初からすべて閲覧できる。ランクによる閲覧ロックは設けない。
- コースランクと進捗率は、そのコースのクイズ正解数から導出する。資格コースの数値ID問題と実務コースの文字列ID問題の両方に対応している。
- コース内の難易度は`learningRanks`のブロンズ・シルバー・ゴールド3段階を維持する。
- アカウントランクは`accountRanks`からXPで導出する。現在の全コンテンツで最高ランクまで到達できるよう、基準はブロンズ0、シルバー300、ゴールド700、プラチナ1100、ダイヤモンド1600、マスター2100。
- XPは問題回答だけで獲得する。初回正解は10 XP、初回不正解は2 XP、不正解後に正解すると不足分の8 XPを獲得する。同じ問題で合計10 XPを超えて獲得できない。
- レッスン閲覧・レッスン完了記録・用語カード確認ではXPを付与しない。既存の回答・進捗保存形式は維持している。

## 現在の注意点

- レッスンHTMLは信頼済みのローカルデータを直接描画している。ユーザー入力を同じ方法で描画しないこと。
- 追加ノートは`hackpath-custom-lessons`へ端末内保存する。`renderContent()`で必ずHTMLエスケープしてから限定的なマークダウンを変換しており、生HTMLを許可しない。
- `getTopicProgress`は参照時にlocalStorageも更新するため、将来は読み取りと保存を分離する余地がある。
- 成績は全コース合算。分野別集計は未実装。問題画面には全問題・未回答・不正解の復習切り替えがある。
- `npm.cmd test`で保存データの分離・移行、XPルール、教材数、ID重複、深掘り教材の構成、短い教材の説明変換を確認できる。ほかの画面は最低限ビルドとデータ整合性を確認すること。
- `npm`はPowerShellの実行ポリシーにより失敗する環境があるため、Windowsでは`npm.cmd`を使用する。
- 日常利用では`HackPathを開く.cmd`をダブルクリックすると、固定URL `http://localhost:5190/` が既定ブラウザで開く。
- 公開WorkerのCSP・権限制限・クリックジャッキング防止ヘッダーを弱める場合は、必要性と影響を確認する。

## 推奨する次の実装

次は、履歴を日別・分野別に集計する成績グラフ、SQLやJavaScriptを安全に試せるブラウザ演習、コース検索と難易度フィルターの順で検討してください。

## 完了条件

- `npm.cmd run build`が成功
- 追加コースがロードマップ、ダッシュボード、学習、クイズ、用語集で開ける
- 既存4資格コースが引き続き開ける
- すべての難易度のレッスンを最初から閲覧できる
- レッスン閲覧と用語確認ではXPが増えず、問題回答だけでXPが増える
- 同じ問題への再回答でXPを重複獲得できない
- `PROGRESS.md`の件数と実データが一致する
