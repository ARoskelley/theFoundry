import { getAllOccupationIds, getOccupation } from '@/lib/getOccupation'
import { getAllCerts } from '@/lib/getCert'
import { buildRoadmapNodes } from '@/lib/buildRoadmapNodes'
import RoadmapFlow from '@/components/roadmap/RoadmapFlow'
import RoadmapProgress from '@/components/progress/RoadmapProgress'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return (await getAllOccupationIds()).map(id => ({ id }))
}

export default async function OccupationPage({ params }) {
  const { id } = await params
  const [occupation, allCerts] = await Promise.all([getOccupation(id), getAllCerts()])

  if (!occupation) return notFound()

  const certLookup = Object.fromEntries(allCerts.map(c => [c.id, c]))
  const { nodes, edges } = buildRoadmapNodes(occupation.suggested_certs, certLookup)
  const roadmapCertIds = nodes.map(node => node.id)

  const totalCost = nodes.reduce((sum, n) => sum + (n.data.cert?.cost || 0), 0)
  const totalWeeks = nodes.reduce((sum, n) => sum + (n.data.cert?.duration_weeks || 0), 0)
  const totalMonths = Math.ceil(totalWeeks / 4)

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        {occupation.industry.replace(/-/g, ' ')}
      </p>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{occupation.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{occupation.description}</p>
      <p style={{ color: 'var(--success)', marginBottom: '32px', fontWeight: '600' }}>
        Avg. Salary: ${occupation.avg_salary?.toLocaleString()}
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <RoadmapStat label="Total Exam Cost" value={`$${totalCost.toLocaleString()}`} note="combined fees" />
        <RoadmapStat label="Est. Study Time" value={`${totalWeeks} wks`} note={`~${totalMonths} month${totalMonths !== 1 ? 's' : ''}`} />
        <RoadmapStat label="Certs in Path" value={nodes.length} note={nodes.length === 1 ? 'certification' : 'certifications'} />
      </div>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text-muted)' }}>
        Certification Roadmap
      </h2>

      <RoadmapProgress certIds={roadmapCertIds} />
      <RoadmapFlow initialNodes={nodes} initialEdges={edges} occupationId={occupation.id} />
    </div>
  )
}

function RoadmapStat({ label, value, note }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px 22px',
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontWeight: '700', fontSize: '1.3rem', marginBottom: '2px' }}>{value}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{note}</p>
    </div>
  )
}
