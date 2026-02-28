'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const levelColors = {
  entry: '#22c55e',
  mid: '#f59e0b',
  senior: '#6366f1',
}

export default function OccupationCard({ occupation }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={`/occupation/${occupation.id}`} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{occupation.title}</span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: levelColors[occupation.level] || 'var(--text-muted)',
            background: 'var(--bg)',
            padding: '3px 10px',
            borderRadius: '99px',
          }}>
            {occupation.level}
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
          {occupation.description}
        </p>

        <p style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.9rem' }}>
          ${occupation.avg_salary?.toLocaleString()} avg
        </p>

        <p style={{ color: 'var(--accent-light)', fontSize: '0.8rem' }}>
          {occupation.suggested_certs?.length} certs in roadmap →
        </p>
      </Link>
    </motion.div>
  )
}
