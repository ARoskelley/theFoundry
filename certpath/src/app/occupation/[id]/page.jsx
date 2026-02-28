import { getAllOccupationIds, getOccupation } from '@/lib/getOccupation'
import { buildRoadmapNodes } from '@/lib/buildRoadmapNodes'
import RoadmapFlow from '@/components/roadmap/RoadmapFlow'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getAllOccupationIds().map(id => ({ id }))
}

export default async function OccupationPage({ params }) {
  const { id } = await params
  const occupation = getOccupation(id)

  if (!occupation) return notFound()

  const { nodes, edges } = buildRoadmapNodes(occupation.suggested_certs)

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        {occupation.industry}
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{occupation.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{occupation.description}</p>
      <p style={{ color: 'var(--success)', marginBottom: '40px', fontWeight: '600' }}>
        Avg. Salary: ${occupation.avg_salary?.toLocaleString()}
      </p>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text-muted)' }}>
        Certification Roadmap
      </h2>

      {/* RoadmapFlow is a client component — data is passed as props */}
      <RoadmapFlow initialNodes={nodes} initialEdges={edges} />
    </div>
  )
}
