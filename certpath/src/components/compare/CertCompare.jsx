'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
const difficultyColors = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }

function formatLabel(value) {
  if (!value) return '—'
  return String(value).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function CertCompare({ certA, certB, allCerts }) {
  const router = useRouter()
  const [activeSlot, setActiveSlot] = useState(() => {
    if (!certA) return 'a'
    if (!certB) return 'b'
    return null
  })
  const [searchQuery, setSearchQuery] = useState('')

  function selectCert(cert) {
    const params = new URLSearchParams()
    if (activeSlot === 'a') {
      params.set('a', cert.id)
      if (certB) params.set('b', certB.id)
    } else {
      if (certA) params.set('a', certA.id)
      params.set('b', cert.id)
    }
    setSearchQuery('')
    setActiveSlot(null)
    router.push(`/compare?${params.toString()}`)
  }

  function clearSlot(slot) {
    const params = new URLSearchParams()
    if (slot === 'a' && certB) params.set('b', certB.id)
    if (slot === 'b' && certA) params.set('a', certA.id)
    router.push(`/compare${params.toString() ? '?' + params.toString() : ''}`)
  }

  const searchResults = allCerts
    .filter(c => {
      if (c.id === certA?.id || c.id === certB?.id) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
    })
    .slice(0, 12)

  return (
    <div>
      {/* Cert slot pickers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '20px',
        alignItems: 'start',
        marginBottom: '32px',
      }}>
        <CertSlot
          cert={certA}
          label="Cert A"
          isActive={activeSlot === 'a'}
          onActivate={() => { setActiveSlot('a'); setSearchQuery('') }}
          onClear={() => clearSlot('a')}
        />
        <div style={{ paddingTop: '32px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center' }}>
          vs
        </div>
        <CertSlot
          cert={certB}
          label="Cert B"
          isActive={activeSlot === 'b'}
          onActivate={() => { setActiveSlot('b'); setSearchQuery('') }}
          onClear={() => clearSlot('b')}
        />
      </div>

      {/* Search panel */}
      {activeSlot && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '40px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
            Selecting <strong style={{ color: 'var(--text)' }}>Cert {activeSlot.toUpperCase()}</strong> — click a cert below
          </p>
          <input
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or issuer..."
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.9rem',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '10px',
            maxHeight: '320px',
            overflowY: 'auto',
          }}>
            {searchResults.map(cert => (
              <button
                key={cert.id}
                onClick={() => selectCert(cert)}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <p style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text)', marginBottom: '4px' }}>
                  {cert.name}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {cert.issuer} · <span style={{ color: difficultyColors[cert.difficulty] }}>{cert.difficulty}</span>
                </p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveSlot(null)}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.82rem',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Comparison table */}
      {certA && certB && (
        <ComparisonTable certA={certA} certB={certB} />
      )}

      {/* Empty state */}
      {!certA && !certB && !activeSlot && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
        }}>
          Select two certifications above to compare them.
        </div>
      )}
    </div>
  )
}

function CertSlot({ cert, label, isActive, onActivate, onClear }) {
  if (!cert) {
    return (
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {label}
        </p>
        <button
          onClick={onActivate}
          style={{
            width: '100%',
            padding: '20px',
            background: isActive ? '#6366f108' : 'var(--surface)',
            border: `2px dashed ${isActive ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '14px',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.15s',
          }}
        >
          {isActive ? 'Search below ↓' : '+ Select cert'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
        {label}
      </p>
      <div style={{
        padding: '18px',
        background: 'var(--surface)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '14px',
        position: 'relative',
      }}>
        <button
          onClick={onClear}
          title="Remove"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            lineHeight: 1,
            padding: '4px',
          }}
        >
          ×
        </button>
        <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px', paddingRight: '24px' }}>
          {cert.name}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          {cert.issuer}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: difficultyColors[cert.difficulty] }}>
            {cert.difficulty}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ${(cert.cost || 0).toLocaleString()}
          </span>
        </div>
        <button
          onClick={onActivate}
          style={{
            marginTop: '10px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-light)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            padding: '0',
          }}
        >
          Change
        </button>
      </div>
    </div>
  )
}

function ComparisonTable({ certA, certB } ) {
  const rows = [
    {
      label: 'Cost',
      a: certA.cost != null ? `$${certA.cost.toLocaleString()}` : '—',
      b: certB.cost != null ? `$${certB.cost.toLocaleString()}` : '—',
      winner: certA.cost != null && certB.cost != null
        ? (certA.cost < certB.cost ? 'a' : certA.cost > certB.cost ? 'b' : 'tie')
        : null,
      winnerNote: 'lower cost',
    },
    {
      label: 'Difficulty',
      a: formatLabel(certA.difficulty),
      b: formatLabel(certB.difficulty),
      winner: null,
      aColor: difficultyColors[certA.difficulty],
      bColor: difficultyColors[certB.difficulty],
    },
    {
      label: 'Est. Study Time',
      a: certA.duration_weeks != null ? `${certA.duration_weeks} weeks` : '—',
      b: certB.duration_weeks != null ? `${certB.duration_weeks} weeks` : '—',
      winner: certA.duration_weeks != null && certB.duration_weeks != null
        ? (certA.duration_weeks < certB.duration_weeks ? 'a' : certA.duration_weeks > certB.duration_weeks ? 'b' : 'tie')
        : null,
      winnerNote: 'shorter',
    },
    {
      label: 'Industry',
      a: formatLabel(certA.industry),
      b: formatLabel(certB.industry),
      winner: null,
    },
    {
      label: 'Exam Questions',
      a: certA.exam_details?.questions != null ? certA.exam_details.questions : '—',
      b: certB.exam_details?.questions != null ? certB.exam_details.questions : '—',
      winner: null,
    },
    {
      label: 'Exam Time',
      a: certA.exam_details?.time_minutes != null ? `${certA.exam_details.time_minutes} min` : '—',
      b: certB.exam_details?.time_minutes != null ? `${certB.exam_details.time_minutes} min` : '—',
      winner: null,
    },
    {
      label: 'Prerequisites',
      a: certA.prerequisites?.length ? certA.prerequisites.length : 'None',
      b: certB.prerequisites?.length ? certB.prerequisites.length : 'None',
      winner: null,
    },
    {
      label: 'Leads To',
      a: certA.leads_to?.length ? `${certA.leads_to.length} cert${certA.leads_to.length !== 1 ? 's' : ''}` : 'End of path',
      b: certB.leads_to?.length ? `${certB.leads_to.length} cert${certB.leads_to.length !== 1 ? 's' : ''}` : 'End of path',
      winner: null,
    },
    {
      label: 'Useful For',
      a: certA.useful_for_occupations?.length ? `${certA.useful_for_occupations.length} role${certA.useful_for_occupations.length !== 1 ? 's' : ''}` : '—',
      b: certB.useful_for_occupations?.length ? `${certB.useful_for_occupations.length} role${certB.useful_for_occupations.length !== 1 ? 's' : ''}` : '—',
      winner: null,
    },
  ]

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr 1fr',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ padding: '14px 18px' }} />
        <div style={{ padding: '14px 18px', borderLeft: '1px solid var(--border)' }}>
          <Link href={`/cert/${certA.id}`} style={{ fontWeight: '700', color: 'var(--accent-light)', fontSize: '0.92rem' }}>
            {certA.name}
          </Link>
        </div>
        <div style={{ padding: '14px 18px', borderLeft: '1px solid var(--border)' }}>
          <Link href={`/cert/${certB.id}`} style={{ fontWeight: '700', color: 'var(--accent-light)', fontSize: '0.92rem' }}>
            {certB.name}
          </Link>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 1fr',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {row.label}
          </div>
          <Cell value={row.a} isWinner={row.winner === 'a'} color={row.aColor} />
          <Cell value={row.b} isWinner={row.winner === 'b'} color={row.bColor} />
        </div>
      ))}
    </div>
  )
}

function Cell({ value, isWinner, color }) {
  return (
    <div style={{
      padding: '14px 18px',
      borderLeft: '1px solid var(--border)',
      background: isWinner ? '#22c55e0a' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ color: color || 'var(--text)', fontSize: '0.92rem', fontWeight: isWinner ? '600' : '400' }}>
        {value}
      </span>
      {isWinner && (
        <span style={{ fontSize: '0.68rem', color: '#22c55e', background: '#22c55e18', padding: '2px 6px', borderRadius: '99px', fontWeight: '700' }}>
          ✓
        </span>
      )}
    </div>
  )
}
