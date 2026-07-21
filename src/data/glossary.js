export const glossary = {
  itp: [
    { id: 'itp-1', term: 'IoT', reading: 'アイオーティ', definition: 'Internet of Things。センサーや機器がインターネットに接続され、データ収集・遠隔制御を行う仕組み。' },
    { id: 'itp-2', term: 'クラウドコンピューティング', reading: '', definition: 'インターネット経由でサーバー・ストレージ等のIT資源をオンデマンド利用するモデル。' },
    { id: 'itp-3', term: 'ビッグデータ', reading: '', definition: '従来のDBでは処理困難な大量・多様・高速なデータ。3V（Volume, Velocity, Variety）が特徴。' },
    { id: 'itp-4', term: 'SLA', reading: 'エスエルエー', definition: 'Service Level Agreement。サービス品質（可用性・応答時間等）に関する提供者と利用者の合意。' },
    { id: 'itp-5', term: 'アジャイル', reading: '', definition: '短いイテレーションで反復開発する手法。スクラムが代表例。' },
    { id: 'itp-6', term: 'DNS', reading: 'ディーエヌエス', definition: 'Domain Name System。ドメイン名とIPアドレスを対応付ける名前解決システム。' },
  ],
  fe: [
    { id: 'fe-1', term: 'OS', reading: 'オーエス', definition: 'Operating System。ハードウェア資源を管理し、アプリケーションにサービスを提供する基盤ソフト。' },
    { id: 'fe-2', term: 'TCP/IP', reading: 'ティーシーピーアイピー', definition: 'インターネットの標準プロトコル群。TCPは信頼性、IPはアドレス指定を担当。' },
    { id: 'fe-3', term: '主キー', reading: '', definition: 'リレーショナルDBで各行を一意に識別するキー。重複・NULL不可が一般的。' },
    { id: 'fe-4', term: 'スタック', reading: '', definition: 'LIFO（後入れ先出し）のデータ構造。関数呼び出し管理等に使用。' },
    { id: 'fe-5', term: 'HTTP', reading: 'エイチティーティーピー', definition: 'HyperText Transfer Protocol。Webの通信プロトコル。ステータスコードで結果を表す。' },
    { id: 'fe-6', term: '2進数', reading: '', definition: '0と1のみで数を表す記数法。コンピュータ内部の基本表現形式。' },
  ],
  ap: [
    { id: 'ap-1', term: 'UML', reading: 'ユーエムエル', definition: 'Unified Modeling Language。システム設計を図示するためのモデリング言語。' },
    { id: 'ap-2', term: 'WBS', reading: 'ダブリュービーエス', definition: 'Work Breakdown Structure。プロジェクトの作業を階層的に分解した構造。' },
    { id: 'ap-3', term: '非機能要件', reading: '', definition: '性能、可用性、セキュリティ等、システムの品質特性に関する要件。' },
    { id: 'ap-4', term: 'デザインパターン', reading: '', definition: 'ソフトウェア設計で繰り返し現れる問題に対する再利用可能な解決策。' },
    { id: 'ap-5', term: 'リスク管理', reading: '', definition: 'プロジェクトのリスクを識別・分析・対応するプロセス。' },
  ],
  sec: [
    { id: 'sec-1', term: 'SQLインジェクション', reading: '', definition: '入力値検証不足を悪用し、不正なSQLを実行させる攻撃。' },
    { id: 'sec-2', term: 'XSS', reading: 'クロスサイトスクリプティング', definition: 'Webページに悪意あるスクリプトを埋め込む攻撃。' },
    { id: 'sec-3', term: 'CTF', reading: 'シーティーエフ', definition: 'Capture The Flag。セキュリティスキルを競うコンテスト形式。' },
    { id: 'sec-4', term: 'ペネトレーションテスト', reading: '', definition: '攻撃者視点でシステムの脆弱性を検査するセキュリティ診断。' },
    { id: 'sec-5', term: 'MFA', reading: 'エムエフエー', definition: 'Multi-Factor Authentication。2つ以上の認証要素で本人確認。' },
    { id: 'sec-6', term: 'ファイアウォール', reading: '', definition: 'ネットワーク通信を監視・制御し、不正アクセスを防ぐセキュリティ機器。' },
  ],
}

export function getGlossaryByTopic(topicId) {
  return glossary[topicId] || []
}
