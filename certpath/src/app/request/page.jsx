'use client'

import { useState } from 'react'

export default function RequestPage() {
  const [industry, setIndustry] = useState('')
  const [roles, setRoles] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!industry.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: '80px 40px', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Request Received</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
          Thanks for suggesting <strong style={{ color: 'var(--text)' }}>{industry}</strong>.
          We review all requests and prioritize based on demand — if enough people ask for the same industry, it moves to the top of the queue.
        </p>
        <button
          type="button"
          onClick={() => {
            setIndustry('')
            setRoles('')
            setNotes('')
            setSubmitted(false)
          }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '60px 40px', maxWidth: '640px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        Community
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Request an Industry</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', lineHeight: '1.6' }}>
        Don't see your field? Tell us what industry you'd like to see and which roles matter most.
        We use these requests to prioritize new data.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>
            Industry name <span style={{ color: '#ef4444' }}>*</span>
          </span>
          <input
            required
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="e.g. Automotive, Real Estate, Aviation…"
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>
            Job roles you'd like to see
          </span>
          <input
            value={roles}
            onChange={e => setRoles(e.target.value)}
            placeholder="e.g. Auto Mechanic, Service Advisor, Estimator"
            style={inputStyle}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Comma-separated if multiple
          </span>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={labelStyle}>
            Anything else?
          </span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Specific certifications you know of, why this industry matters to you, etc."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '13px 28px',
            borderRadius: '10px',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Submit Request
        </button>
      </form>

      <div style={{
        marginTop: '48px',
        padding: '20px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: '1.6',
      }}>
        Currently tracking certifications across{' '}
        <strong style={{ color: 'var(--text)' }}>11 industries</strong>: Cybersecurity, Cloud Computing,
        Networking, DevOps, Data Science, Healthcare, Welding, Construction, HVAC, Electrical, and Project Management.
      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-muted)',
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}
