import { supabase } from './supabase'

export async function getCert(id) {
  const { data, error } = await supabase
    .from('certs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getAllCertIds() {
  const { data, error } = await supabase
    .from('certs')
    .select('id')
    .order('id')

  if (error) return []
  return data.map(row => row.id)
}

export async function getAllCerts() {
  const { data, error } = await supabase
    .from('certs')
    .select('*')
    .order('name')

  if (error) return []
  return data
}

export async function getCertsByIds(ids) {
  if (!ids || ids.length === 0) return []

  const { data, error } = await supabase
    .from('certs')
    .select('*')
    .in('id', ids)

  if (error) return []
  return data
}
