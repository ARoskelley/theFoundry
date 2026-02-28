'use client'

import { useEffect, useState } from 'react'

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

export function setCertCompleted(certId, shouldComplete) {
  if (typeof window === 'undefined' || !certId) return

  const completed = new Set(readCompletedCerts())

  if (shouldComplete) {
    completed.add(certId)
  } else {
    completed.delete(certId)
  }

  writeCompletedCerts(Array.from(completed))
}

export function useCompletedCerts() {
  const [completedCerts, setCompletedCerts] = useState([])

  useEffect(() => {
    function syncCompletedCerts() {
      setCompletedCerts(readCompletedCerts())
    }

    syncCompletedCerts()

    window.addEventListener('storage', syncCompletedCerts)
    window.addEventListener(SYNC_EVENT, syncCompletedCerts)

    return () => {
      window.removeEventListener('storage', syncCompletedCerts)
      window.removeEventListener(SYNC_EVENT, syncCompletedCerts)
    }
  }, [])

  return completedCerts
}
