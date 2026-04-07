import { getAllIndustries, getAllOccupationIds } from '@/lib/getOccupation'
import { getAllCertIds } from '@/lib/getCert'
import IndustryCard from '@/components/industry/IndustryCard'
import Link from 'next/link'

export default async function Home() {
  const industries = await getAllIndustries()
  const certCount = (await getAllCertIds()).length
  const occupationCount = (await getAllOccupationIds()).length

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '100px 40px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow behind hero text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #6366f128 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '99px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            marginBottom: '32px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {certCount} certifications · {industries.length} industries · {occupationCount} roles
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}>
            Know exactly which{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              certs you need.
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: '1.65',
            marginBottom: '40px',
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}>
            CertPath maps the certification landscape across {industries.length} industries —
            giving you a clear, ordered roadmap from where you are to the role you want.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#industries"
              className="hero-cta-primary"
            >
              Explore Industries →
            </a>
            <Link
              href="/certs"
              style={{
                padding: '13px 28px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Browse All Certs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '32px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '8px',
          textAlign: 'center',
        }}>
          <StatBlock number={certCount} label="Certifications tracked" />
          <StatBlock number={industries.length} label="Industries covered" />
          <StatBlock number={occupationCount} label="Career paths mapped" />
          <StatBlock number="100%" label="Free to use" />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{
          textAlign: 'center',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '12px',
        }}>
          How it works
        </p>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: '700',
          marginBottom: '56px',
        }}>
          Three steps to your next credential
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          <Step
            number="01"
            icon="🏭"
            title="Pick an industry"
            body="Choose from fields like Cybersecurity, Healthcare, Construction, Cloud Computing, and more. Each industry is fully mapped with real career paths."
          />
          <Step
            number="02"
            icon="🎯"
            title="Choose a role"
            body="Browse occupations within that industry, see average salaries, and understand the level of experience expected at each stage."
          />
          <Step
            number="03"
            icon="🗺️"
            title="Follow the roadmap"
            body="An interactive flowchart shows every certification you need, in the right order, with prerequisites clearly connected. Mark certs complete as you go."
          />
        </div>
      </section>

      {/* ── Industry grid ────────────────────────────────────── */}
      <section
        id="industries"
        style={{
          padding: '0 40px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
          scrollMarginTop: '80px',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Browse by industry</h2>
          <Link href="/occupations" style={{ color: 'var(--accent-light)', fontSize: '0.9rem', fontWeight: '600' }}>
            View all roles →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '18px',
        }}>
          {industries.map(industry => (
            <IndustryCard key={industry} industry={industry} />
          ))}
        </div>
      </section>

      {/* ── Feature highlights ───────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: '80px 40px',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: '700',
            marginBottom: '48px',
          }}>
            Everything you need to plan your path
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            <Feature
              icon="🗺️"
              title="Visual roadmaps"
              body="Interactive flowcharts show cert prerequisites and progression at a glance. Zoom, pan, and click any node for full details."
            />
            <Feature
              icon="✅"
              title="Progress tracking"
              body="Mark certifications as completed and watch your roadmap update in real time. Progress saves locally — no account needed."
            />
            <Feature
              icon="⇄"
              title="Compare certs"
              body="Put any two certifications side by side to compare cost, exam format, difficulty, and what each one unlocks."
            />
            <Feature
              icon="🔍"
              title="Search & filter"
              body="Browse all 56 certifications filtered by industry, difficulty, and budget. Find the right cert fast."
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700', marginBottom: '16px' }}>
            Don't see your field?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
            We're actively expanding. Let us know which industry you'd like to see and we'll prioritize it.
          </p>
          <Link
            href="/request"
            style={{
              padding: '13px 28px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'inline-block',
            }}
          >
            Request an industry →
          </Link>
        </div>
      </section>
    </div>
  )
}

function StatBlock({ number, label }) {
  return (
    <div style={{ padding: '12px 8px' }}>
      <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-light)', marginBottom: '4px' }}>
        {number}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</p>
    </div>
  )
}

function Step({ number, icon, title, body }) {
  return (
    <div style={{
      padding: '28px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.6rem' }}>{icon}</span>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          color: 'var(--accent)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Step {number}
        </span>
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{body}</p>
    </div>
  )
}

function Feature({ icon, title, body }) {
  return (
    <div style={{
      padding: '24px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>{body}</p>
    </div>
  )
}
