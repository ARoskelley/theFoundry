import fs from 'fs'
import path from 'path'

const certsDir = path.join(process.cwd(), 'data', 'certs')

export function getCert(id) {
  try {
    const filePath = path.join(certsDir, `${id}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getAllCertIds() {
  const index = JSON.parse(fs.readFileSync(path.join(certsDir, 'index.json'), 'utf-8'))
  return index.certs
}

export function getAllCerts() {
  const ids = getAllCertIds()
  return ids.map(id => getCert(id)).filter(Boolean)
}
