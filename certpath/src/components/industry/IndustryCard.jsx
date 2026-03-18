'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Map industry IDs to emojis — expand as you add more industries
const industryIcons = {
  cybersecurity: '🔐',
  'cloud-computing': '☁️',
  networking: '🌐',
  devops: '⚙️',
  'data-science': '📊',
  'project-management': '📋',
  healthcare: '🏥',
  welding: '🔥',
  construction: '🏗️',
  hvac: '❄️',
  electrical: '⚡',
  finance: '💹',
}

// Overrides for industry IDs that don't title-case nicely
const industryLabels = {
  devops: 'DevOps',
  'data-science': 'Data Science',
  'cloud-computing': 'Cloud Computing',
  'project-management': 'Project Management',
  hvac: 'HVAC',
}

export default function IndustryCard({ industry }) {
  const label = industryLabels[industry]
    ?? (industry.charAt(0).toUpperCase() + industry.slice(1).replace(/-/g, ' '))
  const icon = industryIcons[industry] || '🏷️'

  return (
    <motion.div
      whileHover={{ scale: 1.03, borderColor: 'var(--accent)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={`/industry/${industry}`} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '28px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        cursor: 'pointer',
      }}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
        <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Explore certifications →
        </span>
      </Link>
    </motion.div>
  )
}
