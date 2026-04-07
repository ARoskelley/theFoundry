'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'certpath-completed-certs'
const SYNC_EVENT = 'certpath-progress-changed'

function readCompletedCerts() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeCompletedCerts(certIds) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(certIds))
  window.dispatchEvent(new Event(SYNC_EVENT))
}

// Fetch completed cert IDs from Supabase for the currently signed-in user.
// Returns an empty array if not authenticated or on error.
async function fetchSupabaseProgress() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_progress')
    .select('cert_id')
    .eq('user_id', user.id)

  if (error) return []
  return data.map(row => row.cert_id)
}

// Merge locally-completed certs into Supabase (called once on login).
async function syncLocalToSupabase(userId) {
  const localCerts = readCompletedCerts()
  if (localCerts.length === 0) return

  const rows = localCerts.map(cert_id => ({ user_id: userId, cert_id }))
  await supabase.from('user_progress').upsert(rows, { ignoreDuplicates: true })
}

export async function setCertCompleted(certId, shouldComplete) {
  if (typeof window === 'undefined' || !certId) return

  // 1. Update localStorage immediately (instant UI feedback)
  const completed = new Set(readCompletedCerts())
  if (shouldComplete) {
    completed.add(certId)
  } else {
    completed.delete(certId)
  }
  writeCompletedCerts(Array.from(completed))

  // 2. Sync to Supabase if authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (shouldComplete) {
    await supabase.from('user_progress').upsert(
      { user_id: user.id, cert_id: certId },
      { ignoreDuplicates: true }
    )
  } else {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('cert_id', certId)
  }
}

export function useCompletedCerts() {
  const [completedCerts, setCompletedCerts] = useState([])

  useEffect(() => {
    function syncFromStorage() {
      setCompletedCerts(readCompletedCerts())
    }

    // Load localStorage immediately
    syncFromStorage()

    // Merge Supabase progress if authenticated
    fetchSupabaseProgress().then(remoteCerts => {
      if (remoteCerts.length === 0) return

      const merged = new Set([...readCompletedCerts(), ...remoteCerts])
      writeCompletedCerts(Array.from(merged))
      // writeCompletedCerts dispatches SYNC_EVENT, which triggers syncFromStorage below
    })

    window.addEventListener('storage', syncFromStorage)
    window.addEventListener(SYNC_EVENT, syncFromStorage)

    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener(SYNC_EVENT, syncFromStorage)
    }
  }, [])

  // Re-sync when the user's auth state changes (login / logout)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Upload any locally-completed certs to Supabase on first login
        await syncLocalToSupabase(session.user.id)

        // Pull remote progress and merge back into localStorage
        const remoteCerts = await fetchSupabaseProgress()
        if (remoteCerts.length > 0) {
          const merged = new Set([...readCompletedCerts(), ...remoteCerts])
          writeCompletedCerts(Array.from(merged))
        }
      }

      if (event === 'SIGNED_OUT') {
        // Keep localStorage as-is; progress persists after sign-out
        setCompletedCerts(readCompletedCerts())
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return completedCerts
}
