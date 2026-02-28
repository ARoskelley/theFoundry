import fs from 'fs'
import path from 'path'

const occupationsDir = path.join(process.cwd(), 'data', 'occupations')

export function getOccupation(id) {
  try {
    const filePath = path.join(occupationsDir, `${id}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getAllOccupationIds() {
  const index = JSON.parse(fs.readFileSync(path.join(occupationsDir, 'index.json'), 'utf-8'))
  return index.occupations
}

export function getOccupationsByIndustry(industry) {
  const index = JSON.parse(fs.readFileSync(path.join(occupationsDir, 'index.json'), 'utf-8'))
  const ids = index.industries[industry] || []
  return ids.map(id => getOccupation(id)).filter(Boolean)
}

export function getAllIndustries() {
  const index = JSON.parse(fs.readFileSync(path.join(occupationsDir, 'index.json'), 'utf-8'))
  return Object.keys(index.industries)
}
