'use client'

import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
import ProgressToggle from '@/components/progress/ProgressToggle'

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function CertDirectory({ certs, industries }) {
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [maxCost, setMaxCost] = useState('')
  const deferredQuery = useDeferredValue(query)

  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const numericMaxCost = maxCost === '' ? null : Number(maxCost)
  const hasCostLimit = numericMaxCost !== null && !Number.isNaN(numericMaxCost)

  const filteredCerts = certs.filter(cert => {
    const matchesQuery =
      !normalizedQuery ||
      cert.name.toLowerCase().includes(normalizedQuery) ||
      cert.issuer.toLowerCase().includes(normalizedQuery) ||
      (cert.description || '').toLowerCase().includes(normalizedQuery)

    const matchesIndustry = industry === 'all' || cert.industry === industry
    const matchesDifficulty = difficulty === 'all' || cert.difficulty === difficulty
    const matchesCost = !hasCostLimit || cert.cost <= numericMaxCost

    return matchesQuery && matchesIndustry && matchesDifficulty && matchesCost
  })

  const hasActiveFilters = query || industry !== 'all' || difficulty !== 'all' || maxCost !== ''

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Search</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Security, CompTIA, analyst..."
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Industry</span>
          <select value={industry} onChange={event => setIndustry(event.target.value)} style={inputStyle}>
            <option value="all">All industries</option>
            {industries.map(id => (
              <option key={id} value={id}>
                {formatLabel(id)}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Difficulty</span>
          <select value={difficulty} onChange={event => setDifficulty(event.target.value)} style={inputStyle}>
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>Max Cost (USD)</span>
          <input
            type="number"
            min="0"
            value={maxCost}
            onChange={event => setMaxCost(event.target.value)}
            placeholder="No limit"
            style={inputStyle}
          />
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <p style={{ color: 'var(--text-muted)' }}>
          Showing {filteredCerts.length} of {certs.length} certifications
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setIndustry('all')
              setDifficulty('all')
              setMaxCost('')
            }}
            style={{
              ...inputStyle,
              width: 'auto',
              cursor: 'pointer',
              fontSize: '0.82rem',
              padding: '10px 14px',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredCerts.length === 0 ? (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px',
            color: 'var(--text-muted)',
          }}
        >
          No certifications match the current filters.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
          }}
        >
          {filteredCerts.map(cert => (
            <article
              key={cert.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <p style={{ fontSize: '1.02rem', fontWeight: '600', marginBottom: '6px' }}>{cert.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {cert.issuer} - {formatLabel(cert.industry)}
                  </p>
                </div>
                <span
                  style={{
                    color: difficultyColors[cert.difficulty] || 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: 'var(--bg)',
                    borderRadius: '999px',
                    padding: '6px 10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cert.difficulty}
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                {cert.description}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <StatPill label="Cost" value={`$${cert.cost.toLocaleString()}`} />
                <StatPill label="Duration" value={`${cert.duration_weeks} weeks`} />
                <StatPill label="Roles" value={String(cert.useful_for_occupations?.length || 0)} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 'auto',
                }}
              >
                <Link
                  href={`/cert/${cert.id}`}
                  style={{
                    color: 'var(--accent-light)',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                  }}
                >
                  View Details
                </Link>
                <ProgressToggle certId={cert.id} compact />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '999px',
        padding: '7px 10px',
        fontSize: '0.78rem',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: '600' }}>{value}</span>
    </span>
  )
}

function formatLabel(value) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase())
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
