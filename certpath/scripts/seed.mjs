/**
 * One-time seed script: reads existing JSON files from data/ and upserts them
 * into the Supabase certs and occupations tables.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
 *
 * Or, with a .env.local file loaded via --env-file (Node 20.6+):
 *   node --env-file=.env.local scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.')
  process.exit(1)
}

// Use the service role key to bypass RLS during seeding
const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedCerts() {
  const certsDir = join(root, 'data', 'certs')
  const index = JSON.parse(readFileSync(join(certsDir, 'index.json'), 'utf-8'))

  const certs = index.certs.map(id =>
    JSON.parse(readFileSync(join(certsDir, `${id}.json`), 'utf-8'))
  )

  const { error } = await supabase.from('certs').upsert(certs)
  if (error) {
    console.error('Error seeding certs:', error.message)
    process.exit(1)
  }
  console.log(`✓ Seeded ${certs.length} certs`)
}

async function seedOccupations() {
  const occupationsDir = join(root, 'data', 'occupations')
  const index = JSON.parse(readFileSync(join(occupationsDir, 'index.json'), 'utf-8'))

  const occupations = index.occupations.map(id =>
    JSON.parse(readFileSync(join(occupationsDir, `${id}.json`), 'utf-8'))
  )

  const { error } = await supabase.from('occupations').upsert(occupations)
  if (error) {
    console.error('Error seeding occupations:', error.message)
    process.exit(1)
  }
  console.log(`✓ Seeded ${occupations.length} occupations`)
}

console.log('Seeding Supabase...')
await seedCerts()
await seedOccupations()
console.log('Done! Verify with: SELECT count(*) FROM certs; SELECT count(*) FROM occupations;')
