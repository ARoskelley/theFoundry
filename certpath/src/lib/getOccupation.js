import { supabase } from './supabase'

export async function getOccupation(id) {
  const { data, error } = await supabase
    .from('occupations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getAllOccupationIds() {
  const { data, error } = await supabase
    .from('occupations')
    .select('id')
    .order('id')

  if (error) return []
  return data.map(row => row.id)
}

export async function getAllOccupations() {
  const { data, error } = await supabase
    .from('occupations')
    .select('*')
    .order('title')

  if (error) return []
  return data
}

export async function getOccupationsByIndustry(industry) {
  const { data, error } = await supabase
    .from('occupations')
    .select('*')
    .eq('industry', industry)

  if (error) return []
  return data
}

export async function getOccupationsByIds(ids) {
  if (!ids || ids.length === 0) return []

  const { data, error } = await supabase
    .from('occupations')
    .select('*')
    .in('id', ids)

  if (error) return []
  return data
}

export async function getAllIndustries() {
  const { data, error } = await supabase
    .from('occupations')
    .select('industry')

  if (error) return []
  return [...new Set(data.map(row => row.industry))].sort()
}
