import { describe, it } from 'node:test'
import assert from 'node:assert'

if (typeof globalThis.WebSocket === 'undefined') {
  // Provide minimal WebSocket polyfill for Node 20 testing environment
  globalThis.WebSocket = class {} as unknown as typeof WebSocket
}
import {
  parseMigrationFilename,
  computeMigrationDiff,
  maskCredential,
  type MigrationFile,
} from '../src/lib/supabase/migrations-status'
import { createClient as createBrowserClient } from '../src/lib/supabase/client'
import { updateSession } from '../src/lib/supabase/proxy'
import { NextRequest } from 'next/server'

describe('Supabase Migration Status & Parser', () => {
  it('parses valid migration filenames correctly', () => {
    const res1 = parseMigrationFilename('0001_init_starter.sql')
    assert.deepStrictEqual(res1, {
      filename: '0001_init_starter.sql',
      version: '0001',
      name: 'init starter',
    })

    const res2 = parseMigrationFilename('20261114120000_add_user_profiles.sql')
    assert.deepStrictEqual(res2, {
      filename: '20261114120000_add_user_profiles.sql',
      version: '20261114120000',
      name: 'add user profiles',
    })
  })

  it('ignores non-sql files', () => {
    assert.strictEqual(parseMigrationFilename('README.md'), null)
    assert.strictEqual(parseMigrationFilename('schema.dump'), null)
  })

  it('correctly calculates migration diffs between local and remote', () => {
    const local: MigrationFile[] = [
      { filename: '0001_init.sql', version: '0001', name: 'init' },
      { filename: '0002_extra.sql', version: '0002', name: 'extra' },
    ]
    const applied = ['0001']

    const diff = computeMigrationDiff(local, applied)
    assert.strictEqual(diff.length, 2)
    assert.strictEqual(diff[0].status, 'APPLIED')
    assert.strictEqual(diff[1].status, 'PENDING PUSH')
  })

  it('masks credentials without exposing full secrets', () => {
    const masked = maskCredential(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz1234567890'
    )
    assert.ok(masked && masked.includes('...'))
    assert.ok(!masked.includes('xyz1234567890'))
  })
})

describe('Supabase Client & Proxy Safe Fallbacks', () => {
  it('creates browser client safely when env variables are empty/missing', () => {
    const client = createBrowserClient()
    assert.ok(client)
    assert.strictEqual(typeof client.from, 'function')
    assert.strictEqual(typeof client.auth.getSession, 'function')
  })

  it('updateSession proxy skips gracefully when env vars are unconfigured', async () => {
    const req = new NextRequest('http://localhost:3000/')
    const res = await updateSession(req)
    assert.ok(res)
    assert.strictEqual(res.status, 200)
  })
})
