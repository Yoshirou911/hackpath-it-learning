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
- `src/data/ranks.js`: ランク定義、XPランク判定、レッスンの3段階配分
- `src/components/rank.js`: ランクバッジとエンブレムの共通描画
- `src/store.js`: XP、回答、進捗、履歴のlocalStorage保存・クラウド同期・旧データ移行
- `src/router.js`: ルーティング
- `src/pages/`: 各画面
- `PROGRESS.md`: 現在の実装数と次タスク
- `HackPathを開く.cmd`: Windows用ワンクリック起動ランチャー（固定ポート5190）
- `worker/index.js`: 公開環境の静的配信、認証済みユーザーAPI、D1進捗保存、セキュリティヘッダー
- `db/schema.ts`: D1の`user_progress`テーブル定義
- `drizzle/`: Sites公開時に適用するD1マイグレーション
- `vite.config.js` / `wrangler.jsonc`: Sites向けCloudflare Worker・静的アセット設定
- `public/_headers`: 静的アセットへ適用する公開環境のセキュリティヘッダー
- `index.html`: 公開基盤の配信方法に左右されないブラウザ強制CSP

## コース追加手順

実務スキル系コースは原則として`src/data/skillCourses.js`へ追加します。

1. `skillCourseTopics`へトピック情報を追加
2. 同じIDで`skillCourseModules`へレッスンを追加
3. `skillQuestions`へ確認問題を追加
4. `skillGlossary`へ用語を追加
5. 必要なら`src/store.js`の`DEFAULT_STATE.topics`へ初期値を追加
6. `npm.cmd run build`とデータ件数チェックを実行
7. `PROGRESS.md`を更新

トピックIDは英小文字の短い名前にし、レッスンIDは`<topic>-l<number>`、クイズIDは既存の数値IDと衝突しない文字列を使います。

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
- シルバーはブロンズ全完了、ゴールドはブロンズとシルバー全完了で解放する。
- ランク専用の保存フィールドは追加していない。既存の`completedLessonIds`と過去の`completed`件数から毎回導出するため、旧localStorageと互換性がある。
- コース内の難易度は`learningRanks`のブロンズ・シルバー・ゴールド3段階を維持する。
- アカウントランクは`accountRanks`からXPで導出する。現在の全コンテンツで最高ランクまで到達できるよう、基準はブロンズ0、シルバー300、ゴールド700、プラチナ1100、ダイヤモンド1600、マスター2100。
- クイズは初回不正解後に正解し直すと、不足分の8 XPを獲得して正解状態へ更新できる。既存の回答保存形式と互換性を維持している。

## 現在の注意点

- レッスンHTMLは信頼済みのローカルデータを直接描画している。ユーザー入力を同じ方法で描画しないこと。
- `getTopicProgress`は参照時にlocalStorageも更新するため、将来は読み取りと保存を分離する余地がある。
- 成績は全コース合算。分野別集計と苦手問題モードは未実装。
- `npm.cmd test`でアカウント切り替え時の分離と旧localStorage移行を確認できる。ほかの画面は最低限ビルドとデータ整合性を確認すること。
- `npm`はPowerShellの実行ポリシーにより失敗する環境があるため、Windowsでは`npm.cmd`を使用する。
- 日常利用では`HackPathを開く.cmd`をダブルクリックすると、固定URL `http://localhost:5190/` が既定ブラウザで開く。
- 公開WorkerのCSP・権限制限・クリックジャッキング防止ヘッダーを弱める場合は、必要性と影響を確認する。

## 推奨する次の実装

最優先は「復習モード」です。`state.quiz.answered`を利用し、不正解・未回答・全問題を切り替えられるようにします。その後、履歴を日別・分野別に集計する成績グラフを追加してください。

## 完了条件

- `npm.cmd run build`が成功
- 追加コースがロードマップ、ダッシュボード、学習、クイズ、用語集で開ける
- 既存4資格コースが引き続き開ける
- 同じレッスンを再完了してもXPや履歴が増えない
- `PROGRESS.md`の件数と実データが一致する
