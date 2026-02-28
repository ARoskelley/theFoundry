import { getAllIndustries, getOccupationsByIndustry } from '@/lib/getOccupation'
import OccupationCard from '@/components/occupation/OccupationCard'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getAllIndustries().map(id => ({ id }))
}

export default async function IndustryPage({ params }) {
  const { id } = await params
  const occupations = getOccupationsByIndustry(id)

  if (!occupations.length) return notFound()

  const label = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        Industry
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{label}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px' }}>
        Select an occupation to see the recommended certification roadmap.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {occupations.map(occ => (
          <OccupationCard key={occ.id} occupation={occ} />
        ))}
      </div>
    </div>
  )
}
