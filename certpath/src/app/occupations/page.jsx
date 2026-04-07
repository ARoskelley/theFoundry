import { getAllOccupations, getAllIndustries } from '@/lib/getOccupation'
import OccupationDirectory from '@/components/occupation/OccupationDirectory'

export const metadata = {
  title: 'Occupations – CertPath',
  description: 'Browse all roles and career paths across every industry.',
}

export default async function OccupationsPage() {
  const occupations = await getAllOccupations()
  const industries = await getAllIndustries()

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Occupations</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.1rem' }}>
        Browse every role across all industries and explore the certification roadmap to get there.
      </p>
      <OccupationDirectory occupations={occupations} industries={industries} />
    </div>
  )
}
