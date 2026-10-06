import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

const root = new URL('../', import.meta.url)

test('package declares a bundle patch', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml')
  assert.equal(pkg.exports?.['./cordis.patch.yml'], './cordis.patch.yml')
  assert.ok(pkg.files.includes('cordis.patch.yml'))
})

test('patch inserts the mcp-client row that runs google-classroom-mcp', async () => {
  const patch = parse(await readFile(new URL('cordis.patch.yml', root), 'utf8'))
  assert.ok(Array.isArray(patch), 'patch must be a list of layers')
  const rows = patch.flatMap((layer) => layer.insert ?? [])
  const row = rows.find((entry) => entry.id === 'mcp-google-classroom')
  assert.ok(row, 'row mcp-google-classroom is missing')
  assert.equal(row.name, '@deepseek-ai/dsh-mcp-client')
  assert.equal(row.config.serverName, 'google-classroom')
  assert.equal(row.config.transport, 'stdio')
  assert.equal(row.config.command, 'uvx')
  assert.ok(row.config.args.includes('google-classroom-mcp'))
})
