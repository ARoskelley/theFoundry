'use client'

import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
import { motion } from 'framer-motion'

const levelColors = {
  entry: '#22c55e',
  mid: '#f59e0b',
  senior: '#6366f1',
}

const salaryBands = [
  { label: 'All salaries', value: 'all' },
  { label: 'Under $70k', value: 'under-70' },
  { label: '$70k – $110k', value: '70-110' },
  { label: 'Over $110k', value: 'over-110' },
]

function matchesSalaryBand(salary, band) {
  if (band === 'all') return true
  if (band === 'under-70') return salary < 70000
  if (band === '70-110') return salary >= 70000 && salary <= 110000
  if (band === 'over-110') return salary > 110000
  return true
}

function formatLabel(value) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function OccupationDirectory({ occupations, industries }) {
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('all')
  const [level, setLevel] = useState('all')
  const [salaryBand, setSalaryBand] = useState('all')
  const deferredQuery = useDeferredValue(query)

  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const filtered = occupations.filter(occ => {
    const matchesQuery =
      !normalizedQuery ||
      occ.title.toLowerCase().includes(normalizedQuery) ||
      (occ.description || '').toLowerCase().includes(normalizedQuery)

    const matchesIndustry = industry === 'all' || occ.industry === industry
    const matchesLevel = level === 'all' || occ.level === level
    const matchesSalary = matchesSalaryBand(occ.avg_salary || 0, salaryBand)

    return matchesQuery && matchesIndustry && matchesLevel && matchesSalary
  })

  const hasActiveFilters = query || industry !== 'all' || level !== 'all' || salaryBand !== 'all'

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px',
      }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Search</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Role title or keyword..."
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Industry</span>
          <select value={industry} onChange={e => setIndustry(e.target.value)} style={inputStyle}>
            <option value="all">All industries</option>
            {industries.map(id => (
              <option key={id} value={id}>{formatLabel(id)}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Level</span>
          <select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>
            <option value="all">All levels</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Salary Range</span>
          <select value={salaryBand} onChange={e => setSalaryBand(e.target.value)} style={inputStyle}>
            {salaryBands.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <p style={{ color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {occupations.length} occupations
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setQuery(''); setIndustry('all'); setLevel('all'); setSalaryBand('all') }}
            style={{ ...inputStyle, width: 'auto', cursor: 'pointer', fontSize: '0.82rem', padding: '10px 14px' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '28px',
          color: 'var(--text-muted)',
        }}>
          No occupations match the current filters.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {filtered.map(occ => (
            <motion.article
              key={occ.id}
              whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <p style={{ fontWeight: '600', fontSize: '1rem' }}>{occ.title}</p>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: levelColors[occ.level] || 'var(--text-muted)',
                  background: 'var(--bg)',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  whiteSpace: 'nowrap',
                }}>
                  {occ.level}
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', flexGrow: 1 }}>
                {occ.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.9rem' }}>
                  ${occ.avg_salary?.toLocaleString()} avg
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {formatLabel(occ.industry)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <Link href={`/occupation/${occ.id}`} style={{ color: 'var(--accent-light)', fontWeight: '600', fontSize: '0.88rem' }}>
                  View Roadmap →
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {occ.suggested_certs?.length} certs
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '0.9rem',
}
