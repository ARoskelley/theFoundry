import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      height: '64px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent-light)' }}>
        CertPath
      </Link>
      <div style={{ display: 'flex', gap: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <Link href="/">Industries</Link>
        {/* Add more nav links as the app grows */}
      </div>
    </nav>
  )
}
