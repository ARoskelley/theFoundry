'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CertBreadcrumb() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  if (!from) return null

  const label = from.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <Link
      href={`/occupation/${from}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginBottom: '24px',
        textDecoration: 'none',
      }}
    >
      ← {label}
    </Link>
  )
}
