# HackPath AI引き継ぎガイド

この文書は、別のAIや開発者が現在の状態から安全に作業を継続するための資料です。

## プロダクト方針

HackPathは、資格暗記だけでなく「解説 → 確認問題 → 用語復習 → 学習履歴」の流れで幅広いIT知識を学べるソフトを目指しています。初心者向けの分かりやすさ、実務につながる説明、安全・倫理への配慮を優先してください。

## 技術構成

- Vite
- Vanilla JavaScript（ES Modules）
- CSS
- hashベースのクライアントルーティング
- localStorageキー: `hackpath-progress`
- バックエンド、認証、外部APIは未導入

## 重要ファイル

- `src/data/topics.js`: 全コースのメタデータを統合
- `src/data/content.js`: 全学習モジュールを統合
- `src/data/questions.js`: 全クイズを統合
- `src/data/glossary.js`: 全用語を統合
- `src/data/skillCourses.js`: 新しい実務スキル系コースの定義
- `src/data/ranks.js`: ランク定義、XPランク判定、レッスンの3段階配分
- `src/components/rank.js`: ランクバッジとエンブレムの共通描画
- `src/store.js`: XP、回答、進捗、履歴の永続化
- `src/router.js`: ルーティング
- `src/pages/`: 各画面
- `PROGRESS.md`: 現在の実装数と次タスク
- `HackPathを開く.cmd`: Windows用ワンクリック起動ランチャー（固定ポート5190）
- `worker/index.js`: 公開環境の静的配信とセキュリティヘッダー
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

## ランクシステム

- ブロンズは基礎、シルバーは応用、ゴールドは上級に対応する。
- `getStageLayout()`がコース内レッスンをおおむね4:3:3で自動配分する。3レッスンの実務コースは1:1:1になる。
- シルバーはブロンズ全完了、ゴールドはブロンズとシルバー全完了で解放する。
- ランク専用の保存フィールドは追加していない。既存の`completedLessonIds`と過去の`completed`件数から毎回導出するため、旧localStorageと互換性がある。
- コース内の難易度は`learningRanks`のブロンズ・シルバー・ゴールド3段階を維持する。
- アカウントランクは`accountRanks`からXPで導出する。基準はブロンズ0、シルバー500、ゴールド1500、プラチナ3000、ダイヤモンド6000、マスター10000。

## 現在の注意点

- レッスンHTMLは信頼済みのローカルデータを直接描画している。ユーザー入力を同じ方法で描画しないこと。
- `getTopicProgress`は参照時にlocalStorageも更新するため、将来は読み取りと保存を分離する余地がある。
- 成績は全コース合算。分野別集計と苦手問題モードは未実装。
- 自動テストは未導入。最低限ビルドとデータ整合性を確認すること。
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
