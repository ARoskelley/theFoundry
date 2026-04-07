import { getCert, getAllCerts } from '@/lib/getCert'
import CertCompare from '@/components/compare/CertCompare'

export const metadata = {
  title: 'Compare Certifications – CertPath',
  description: 'Compare two certifications side by side — cost, difficulty, exam format, and more.',
}

export default async function ComparePage({ searchParams }) {
  const { a, b } = await searchParams
  const certA = a ? await getCert(a) : null
  const certB = b ? await getCert(b) : null
  const allCerts = await getAllCerts()

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Compare Certifications</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.1rem' }}>
        Pick two certifications to compare cost, difficulty, exam format, and more side by side.
      </p>
      <CertCompare certA={certA} certB={certB} allCerts={allCerts} />
    </div>
  )
}
