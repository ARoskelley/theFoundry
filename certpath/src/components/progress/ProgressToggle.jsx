'use client'

import { setCertCompleted, useCompletedCerts } from './useCompletedCerts'

export default function ProgressToggle({ certId, compact = false }) {
  const completedCerts = useCompletedCerts()
  const isCompleted = completedCerts.includes(certId)

  return (
    <button
      type="button"
      onClick={() => setCertCompleted(certId, !isCompleted)}
      style={{
        border: '1px solid',
        borderColor: isCompleted ? 'var(--success)' : 'var(--border)',
        background: isCompleted ? 'rgba(34, 197, 94, 0.12)' : 'var(--surface)',
        color: isCompleted ? 'var(--success)' : 'var(--text)',
        borderRadius: '999px',
        padding: compact ? '8px 12px' : '10px 16px',
        fontSize: compact ? '0.78rem' : '0.88rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {isCompleted ? 'Completed' : compact ? 'Mark Complete' : 'Mark As Completed'}
    </button>
  )
}
