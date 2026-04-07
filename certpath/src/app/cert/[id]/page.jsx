import { getCert, getAllCertIds } from '@/lib/getCert'
import { getOccupationsByIds } from '@/lib/getOccupation'
import OccupationCard from '@/components/occupation/OccupationCard'
import ProgressToggle from '@/components/progress/ProgressToggle'
import CertBreadcrumb from '@/components/cert/CertBreadcrumb'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export async function generateStaticParams() {
  return (await getAllCertIds()).map(id => ({ id }))
}

export default async function CertPage({ params }) {
  const { id } = await params
  const cert = await getCert(id)

  if (!cert) return notFound()

  const relatedOccupations = await getOccupationsByIds(cert.useful_for_occupations)
  const relatedOccupationIds = new Set(relatedOccupations.map(occupation => occupation.id))
  const unresolvedOccupationIds = (cert.useful_for_occupations || []).filter(
    occupationId => !relatedOccupationIds.has(occupationId)
  )

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Suspense fallback={null}>
        <CertBreadcrumb />
      </Suspense>

      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        {cert.issuer}
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{cert.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{cert.description}</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <ProgressToggle certId={cert.id} />
        <Link
          href={`/compare?a=${cert.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Compare ⇄
        </Link>
        {cert.sources?.[0] && (
          <a
            href={cert.sources[0]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--accent-light)',
              fontWeight: '600',
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Official Site ↗
          </a>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Stat label="Cost" value={`$${cert.cost.toLocaleString()}`} />
        <Stat label="Est. Duration" value={`${cert.duration_weeks} weeks`} />
        <Stat label="Difficulty" value={cert.difficulty} color={difficultyColors[cert.difficulty]} />
        {cert.exam_details?.questions != null && (
          <Stat label="Questions" value={cert.exam_details.questions} />
        )}
        {cert.exam_details?.passing_score != null && (
          <Stat label="Passing Score" value={cert.exam_details.passing_score} />
        )}
        {cert.exam_details?.time_minutes != null && (
          <Stat label="Exam Time" value={`${cert.exam_details.time_minutes} min`} />
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

      {relatedOccupations.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Start From This Cert
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
            These occupations already point back to this certification in the current roadmap data.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {relatedOccupations.map(occupation => (
              <OccupationCard key={occupation.id} occupation={occupation} />
            ))}
          </div>
        </div>
      )}

      {unresolvedOccupationIds.length > 0 && (
        <Section title={relatedOccupations.length ? 'Additional Linked Roles' : 'Linked Roles'}>
          {unresolvedOccupationIds.map(occupationId => (
            <OccupationTag key={occupationId} id={occupationId} />
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

function OccupationTag({ id }) {
  const label = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'var(--text)',
      fontSize: '0.9rem',
    }}>
      {label}
    </span>
  )
}
