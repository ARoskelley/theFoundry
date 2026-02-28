import { getAllIndustries } from '@/lib/getOccupation'
import IndustryCard from '@/components/industry/IndustryCard'

export default function Home() {
  const industries = getAllIndustries()

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
        Find Your Path
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.1rem' }}>
        Pick an industry to explore occupations and the certifications that get you there.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {industries.map(industry => (
          <IndustryCard key={industry} industry={industry} />
        ))}
      </div>
    </div>
  )
}
