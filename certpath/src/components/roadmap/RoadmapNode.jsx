'use client'
import { Handle, Position } from 'reactflow'
import Link from 'next/link'

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

const statusBorderColors = {
  completed: '#22c55e',
  ready: '#6366f1',
  locked: 'var(--border)',
}

export default function RoadmapNode({ data }) {
  const { cert, status, occupationId } = data
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isReady = status === 'ready'
  const borderColor = statusBorderColors[status] || 'var(--border)'
  const href = `/cert/${cert.id}${occupationId ? `?from=${occupationId}` : ''}`

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '14px 18px',
        minWidth: '200px',
        maxWidth: '220px',
        cursor: isLocked ? 'default' : 'pointer',
        transition: 'border-color 0.15s, opacity 0.15s',
        opacity: isLocked ? 0.5 : 1,
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor }}
    >
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent)' }} />

      {isCompleted && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          fontSize: '0.65rem',
          fontWeight: '700',
          color: '#22c55e',
          background: '#22c55e18',
          padding: '2px 7px',
          borderRadius: '99px',
        }}>
          ✓ Done
        </div>
      )}

      {isReady && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          fontSize: '0.65rem',
          fontWeight: '700',
          color: '#6366f1',
          background: '#6366f118',
          padding: '2px 7px',
          borderRadius: '99px',
        }}>
          Ready
        </div>
      )}

      <Link href={href}>
        <p style={{
          fontWeight: '600',
          fontSize: '0.9rem',
          marginBottom: '6px',
          color: 'var(--text)',
          paddingRight: isCompleted || isReady ? '44px' : '0',
        }}>
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
            ${(cert.cost || 0).toLocaleString()}
          </span>
        </div>
      </Link>

      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent)' }} />
    </div>
  )
}
