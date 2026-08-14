import { access, copyFile, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const distDirectory = new URL('../dist/', import.meta.url)
const entries = await readdir(distDirectory, { withFileTypes: true })
let workerDirectory
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name === 'client' || entry.name === 'server') continue
  try {
    await access(new URL(`../dist/${entry.name}/index.js`, import.meta.url))
    await access(new URL(`../dist/${entry.name}/wrangler.json`, import.meta.url))
    workerDirectory = entry
    break
  } catch {
    // Ignore regular asset directories.
  }
}

if (!workerDirectory) {
  throw new Error('Cloudflare Worker build output was not found in dist')
}

const source = new URL(`../dist/${workerDirectory.name}/index.js`, import.meta.url)
const serverDirectory = new URL('../dist/server/', import.meta.url)
const hostingDirectory = new URL('../dist/.openai/', import.meta.url)
await mkdir(serverDirectory, { recursive: true })
await mkdir(hostingDirectory, { recursive: true })
await copyFile(source, new URL('index.js', serverDirectory))
await copyFile(new URL('../.openai/hosting.json', import.meta.url), new URL('hosting.json', hostingDirectory))

console.log(`Prepared Sites Worker from ${join('dist', workerDirectory.name, 'index.js')} with hosting metadata`)
