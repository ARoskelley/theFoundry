import { getCert, getAllCertIds } from '@/lib/getCert'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function CertPage({ params }) {
  const { id } = params
  const cert = getCert(id)

  if (!cert) return notFound()

  return (
    <div style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        {cert.issuer}
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{cert.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{cert.description}</p>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Stat label="Cost" value={`$${cert.cost}`} />
        <Stat label="Est. Duration" value={`${cert.duration_weeks} weeks`} />
        <Stat label="Difficulty" value={cert.difficulty} color={difficultyColors[cert.difficulty]} />
        {cert.exam_details && (
          <>
            <Stat label="Questions" value={cert.exam_details.questions} />
            <Stat label="Passing Score" value={cert.exam_details.passing_score} />
          </>
        )}
      </div>

      {cert.prerequisites?.length > 0 && (
        <Section title="Prerequisites">
          {cert.prerequisites.map(pid => (
            <CertLink key={pid} id={pid} />
          ))}
        </Section>
      )}

      {cert.leads_to?.length > 0 && (
        <Section title="What This Unlocks">
          {cert.leads_to.map(pid => (
            <CertLink key={pid} id={pid} />
          ))}
        </Section>
      )}

      {cert.useful_for_occupations?.length > 0 && (
        <Section title="Helpful For These Roles">
          {cert.useful_for_occupations.map(oid => (
            <OccupationLink key={oid} id={oid} />
          ))}
        </Section>
      )}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 24px' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontWeight: '600', color: color || 'var(--text)' }}>{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{children}</div>
    </div>
  )
}

function CertLink({ id }) {
  const label = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <Link href={`/cert/${id}`} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'var(--accent-light)',
      fontSize: '0.9rem',
    }}>
      {label}
    </Link>
  )
}

function OccupationLink({ id }) {
  const label = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <Link href={`/occupation/${id}`} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'var(--text)',
      fontSize: '0.9rem',
    }}>
      {label}
    </Link>
  )
}
