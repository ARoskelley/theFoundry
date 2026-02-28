import CertDirectory from '@/components/cert/CertDirectory'
import { getAllCerts } from '@/lib/getCert'
import { getAllIndustries } from '@/lib/getOccupation'

export default function CertsPage() {
  const certs = getAllCerts().sort((a, b) => a.name.localeCompare(b.name))
  const industries = getAllIndustries()

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <p style={{ color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
        Directory
      </p>
      <h1 style={{ fontSize: '2.3rem', marginBottom: '12px' }}>Browse Certifications</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '760px', lineHeight: '1.6' }}>
        Search by name, compare costs, and narrow the list by industry or difficulty before you commit to a path.
      </p>

      <CertDirectory certs={certs} industries={industries} />
    </div>
  )
}
