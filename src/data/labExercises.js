// 演習ラボの課題。ブラウザ内で完結し、外部サービスへは接続しない。
// 各課題は指定した関数名を定義してもらい、入出力の一致で自動判定する。

export const labExercises = [
  {
    id: 'lab-sum-all',
    title: '数値の合計を求める',
    level: 'beginner',
    topicId: 'programming',
    tags: ['配列', 'ループ'],
    brief: '配列の要素をすべて足し合わせる、もっとも基本的な集計処理です。',
    requirement: '数値の配列を受け取り、その合計を返す関数 sumAll を定義してください。空配列は 0 を返します。',
    functionName: 'sumAll',
    starterCode: `function sumAll(numbers) {
  // ここに処理を書く
  return 0
}`,
    hints: [
      '合計を入れる変数を0で初期化し、for...of で1つずつ足していきます。',
      '配列には reduce((total, value) => total + value, 0) という書き方もあります。',
    ],
    cases: [
      { label: '正の数', args: [[1, 2, 3, 4]], expected: 10 },
      { label: '負の数を含む', args: [[10, -3, -7]], expected: 0 },
      { label: '空配列', args: [[]], expected: 0 },
      { label: '1要素', args: [[42]], expected: 42 },
    ],
    solution: `function sumAll(numbers) {
  let total = 0
  for (const value of numbers) {
    total += value
  }
  return total
}`,
  },
  {
    id: 'lab-fizzbuzz',
    title: 'FizzBuzzを組み立てる',
    level: 'beginner',
    topicId: 'programming',
    tags: ['条件分岐', '剰余'],
    brief: '条件分岐と剰余演算の順番を意識する、定番の練習課題です。',
    requirement: '1からnまでを配列で返す関数 fizzBuzz を定義してください。3の倍数は "Fizz"、5の倍数は "Buzz"、15の倍数は "FizzBuzz"、それ以外は数値のままにします。',
    functionName: 'fizzBuzz',
    starterCode: `function fizzBuzz(n) {
  const result = []
  // ここに処理を書く
  return result
}`,
    hints: [
      '15の倍数の判定を先に書かないと、3や5の条件に先に一致してしまいます。',
      '剰余は value % 3 === 0 のように書きます。',
    ],
    cases: [
      { label: '1〜5', args: [5], expected: [1, 2, 'Fizz', 4, 'Buzz'] },
      { label: '1〜15', args: [15], expected: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'] },
      { label: 'n=0は空', args: [0], expected: [] },
    ],
    solution: `function fizzBuzz(n) {
  const result = []
  for (let value = 1; value <= n; value += 1) {
    if (value % 15 === 0) result.push('FizzBuzz')
    else if (value % 3 === 0) result.push('Fizz')
    else if (value % 5 === 0) result.push('Buzz')
    else result.push(value)
  }
  return result
}`,
  },
  {
    id: 'lab-unique',
    title: '重複を取り除く',
    level: 'beginner',
    topicId: 'programming',
    tags: ['Set', '配列'],
    brief: 'ログの集計やタグ一覧など、実務で頻繁に必要になる処理です。',
    requirement: '配列から重複を取り除き、最初に現れた順序を保った配列を返す関数 unique を定義してください。',
    functionName: 'unique',
    starterCode: `function unique(items) {
  // ここに処理を書く
  return items
}`,
    hints: [
      'Set は重複を自動的に取り除き、挿入順を保ちます。',
      '[...new Set(items)] で配列へ戻せます。',
    ],
    cases: [
      { label: '文字列', args: [['a', 'b', 'a', 'c', 'b']], expected: ['a', 'b', 'c'] },
      { label: '数値', args: [[3, 1, 3, 3, 2]], expected: [3, 1, 2] },
      { label: '重複なし', args: [['x', 'y']], expected: ['x', 'y'] },
      { label: '空配列', args: [[]], expected: [] },
    ],
    solution: `function unique(items) {
  return [...new Set(items)]
}`,
  },
  {
    id: 'lab-count-words',
    title: '単語の出現回数を数える',
    level: 'intermediate',
    topicId: 'programming',
    tags: ['オブジェクト', '文字列'],
    brief: 'ログ解析やアクセス集計の基礎になる、キーごとの件数集計です。',
    requirement: '空白区切りの文字列を受け取り、単語をキー、出現回数を値とするオブジェクトを返す関数 countWords を定義してください。大文字小文字は区別しません。空文字列は空オブジェクトを返します。',
    functionName: 'countWords',
    starterCode: `function countWords(text) {
  const counts = {}
  // ここに処理を書く
  return counts
}`,
    hints: [
      'text.toLowerCase().split(/\\s+/) で単語へ分割できます。空文字列の扱いに注意してください。',
      'counts[word] = (counts[word] || 0) + 1 で件数を積み上げられます。',
    ],
    cases: [
      { label: '重複あり', args: ['tcp ip tcp'], expected: { tcp: 2, ip: 1 } },
      { label: '大文字小文字', args: ['SQL sql Sql'], expected: { sql: 3 } },
      { label: '空文字列', args: [''], expected: {} },
      { label: '前後の空白', args: ['  dns  dns '], expected: { dns: 2 } },
    ],
    solution: `function countWords(text) {
  const counts = {}
  const words = text.toLowerCase().trim().split(/\\s+/).filter(Boolean)
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1
  }
  return counts
}`,
  },
  {
    id: 'lab-group-by-category',
    title: 'カテゴリごとにまとめる',
    level: 'intermediate',
    topicId: 'data',
    tags: ['オブジェクト', 'グルーピング'],
    brief: 'SQLのGROUP BYに相当する処理を、JavaScriptの配列で組み立てます。',
    requirement: '{ name, category } の配列を受け取り、カテゴリ名をキー、その名前の配列を値とするオブジェクトを返す関数 groupByCategory を定義してください。並び順は入力順を保ちます。',
    functionName: 'groupByCategory',
    starterCode: `function groupByCategory(items) {
  const groups = {}
  // ここに処理を書く
  return groups
}`,
    hints: [
      'キーがまだ無いときは空配列を作ってから push します。',
      'groups[item.category] ??= [] という書き方も使えます。',
    ],
    cases: [
      {
        label: '2カテゴリ',
        args: [[
          { name: 'tcp', category: 'network' },
          { name: 'index', category: 'database' },
          { name: 'dns', category: 'network' },
        ]],
        expected: { network: ['tcp', 'dns'], database: ['index'] },
      },
      { label: '空配列', args: [[]], expected: {} },
      { label: '1件', args: [[{ name: 'ls', category: 'linux' }]], expected: { linux: ['ls'] } },
    ],
    solution: `function groupByCategory(items) {
  const groups = {}
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = []
    groups[item.category].push(item.name)
  }
  return groups
}`,
  },
  {
    id: 'lab-subnet-hosts',
    title: 'サブネットの割当可能ホスト数',
    level: 'intermediate',
    topicId: 'network',
    tags: ['ネットワーク', '計算'],
    brief: 'IPv4のプレフィックス長から、実際に機器へ割り当てられるアドレス数を求めます。',
    requirement: 'プレフィックス長（0〜32）を受け取り、割当可能なホスト数を返す関数 usableHosts を定義してください。ネットワークアドレスとブロードキャストアドレスを除きます。/31 と /32 は 0 を返します。',
    functionName: 'usableHosts',
    starterCode: `function usableHosts(prefixLength) {
  // ここに処理を書く
  return 0
}`,
    hints: [
      'ホスト部のビット数は 32 - prefixLength です。',
      '2のべき乗は 2 ** hostBits で計算できます。除外する2つを引き忘れないようにしてください。',
    ],
    cases: [
      { label: '/24', args: [24], expected: 254 },
      { label: '/30', args: [30], expected: 2 },
      { label: '/31', args: [31], expected: 0 },
      { label: '/32', args: [32], expected: 0 },
      { label: '/16', args: [16], expected: 65534 },
    ],
    solution: `function usableHosts(prefixLength) {
  const hostBits = 32 - prefixLength
  if (hostBits < 2) return 0
  return 2 ** hostBits - 2
}`,
  },
  {
    id: 'lab-binary-search',
    title: '二分探索を実装する',
    level: 'advanced',
    topicId: 'programming',
    tags: ['アルゴリズム', '探索'],
    brief: '基本情報の科目Bでも問われる、計算量O(log n)の探索アルゴリズムです。',
    requirement: '昇順に並んだ数値配列と探索値を受け取り、見つかった添字（0始まり）を返す関数 binarySearch を定義してください。見つからない場合は -1 を返します。',
    functionName: 'binarySearch',
    starterCode: `function binarySearch(sortedNumbers, target) {
  // ここに処理を書く
  return -1
}`,
    hints: [
      '探索範囲の左端と右端を変数で持ち、中央と比較して片側へ狭めます。',
      '中央は Math.floor((left + right) / 2) で求めます。left <= right の間だけ繰り返します。',
    ],
    cases: [
      { label: '中央にある', args: [[1, 3, 5, 7, 9], 5], expected: 2 },
      { label: '先頭', args: [[1, 3, 5, 7, 9], 1], expected: 0 },
      { label: '末尾', args: [[1, 3, 5, 7, 9], 9], expected: 4 },
      { label: '存在しない', args: [[1, 3, 5, 7, 9], 4], expected: -1 },
      { label: '空配列', args: [[], 1], expected: -1 },
    ],
    solution: `function binarySearch(sortedNumbers, target) {
  let left = 0
  let right = sortedNumbers.length - 1
  while (left <= right) {
    const middle = Math.floor((left + right) / 2)
    if (sortedNumbers[middle] === target) return middle
    if (sortedNumbers[middle] < target) left = middle + 1
    else right = middle - 1
  }
  return -1
}`,
  },
  {
    id: 'lab-escape-html',
    title: 'HTMLエスケープを実装する',
    level: 'advanced',
    topicId: 'sec',
    tags: ['セキュリティ', 'XSS対策'],
    brief: 'クロスサイトスクリプティングを防ぐ基本手段を、自分の手で実装して仕組みを理解します。',
    requirement: '文字列中の & < > " \' を、それぞれ &amp; &lt; &gt; &quot; &#39; へ置き換える関数 escapeHtml を定義してください。& を最初に置き換えるのが要点です。',
    functionName: 'escapeHtml',
    starterCode: `function escapeHtml(text) {
  // ここに処理を書く
  return text
}`,
    hints: [
      '& を後から置き換えると、先に作った &lt; の & を二重変換してしまいます。',
      'replace(/&/g, "&amp;") のように、正規表現へ g フラグを付けてすべて置き換えます。',
    ],
    cases: [
      { label: 'scriptタグ', args: ['<script>alert(1)</script>'], expected: '&lt;script&gt;alert(1)&lt;/script&gt;' },
      { label: '引用符', args: ['say "hi" & \'bye\''], expected: 'say &quot;hi&quot; &amp; &#39;bye&#39;' },
      { label: '二重変換しない', args: ['a & b < c'], expected: 'a &amp; b &lt; c' },
      { label: '対象なし', args: ['plain text'], expected: 'plain text' },
    ],
    solution: `function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}`,
  },
]

export const labLevelLabels = {
  beginner: '基礎',
  intermediate: '応用',
  advanced: '上級',
}

export function getLabExercise(exerciseId) {
  return labExercises.find((exercise) => exercise.id === exerciseId) || null
}
