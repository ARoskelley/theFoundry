'use client'
import { Handle, Position } from 'reactflow'
import Link from 'next/link'

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function RoadmapNode({ data }) {
  const { cert } = data

  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '14px 18px',
      minWidth: '200px',
      maxWidth: '220px',
      cursor: 'pointer',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Target handle (receives arrows from prerequisites) */}
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent)' }} />

      <Link href={`/cert/${cert.id}`}>
        <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text)' }}>
          {cert.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {cert.issuer}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: difficultyColors[cert.difficulty] || 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {cert.difficulty}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ${cert.cost}
          </span>
        </div>
      </Link>

      {/* Source handle (sends arrows to follow-up certs) */}
      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent)' }} />
    </div>
  )
}
