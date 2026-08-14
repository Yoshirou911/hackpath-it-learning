import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { currentVersion, latestRelease, releaseHistory } from '../src/data/releases.js'
import { toolNavItems } from '../src/components/layout.js'
import { renderUpdates } from '../src/pages/updates.js'

test('現在バージョンはpackage.jsonと最新リリースで一致する', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

  assert.equal(currentVersion, latestRelease.version)
  assert.equal(currentVersion, packageJson.version)
  assert.match(currentVersion, /^\d+\.\d+\.\d+$/)
})

test('リリース履歴は重複のないバージョンと変更内容を持つ', () => {
  const versions = releaseHistory.map((release) => release.version)

  assert.equal(new Set(versions).size, versions.length)
  releaseHistory.forEach((release) => {
    assert.match(release.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(release.title && release.summary)
    assert.ok(release.sections.length > 0)
    assert.ok(release.sections.every((section) => section.label && section.items.length > 0))
  })
})

test('アップデート画面と左メニューに現在バージョンを表示する', () => {
  const html = renderUpdates()

  assert.ok(toolNavItems.some((item) => item.path === '/updates'))
  assert.match(html, new RegExp(`HackPath v${currentVersion.replaceAll('.', '\\.')}`))
  releaseHistory.forEach((release) => assert.match(html, new RegExp(`v${release.version.replaceAll('.', '\\.')}`)))
})
