'use client'

import { useCompletedCerts } from './useCompletedCerts'

export default function RoadmapProgress({ certIds }) {
  const completedCerts = useCompletedCerts()
  const completedSet = new Set(completedCerts)
  const completedCount = certIds.filter(id => completedSet.has(id)).length
  const totalCount = certIds.length
  const completionPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            Progress Tracking
          </p>
          <p style={{ fontSize: '1rem', fontWeight: '600' }}>
            {completedCount} of {totalCount} roadmap certs completed
          </p>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--accent-light)', fontWeight: '600' }}>
          {completionPercent}% complete
        </p>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          background: 'var(--bg)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${completionPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--success), var(--accent))',
          }}
        />
      </div>
    </div>
  )
}
