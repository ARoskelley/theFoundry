'use client'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RoadmapNode from './RoadmapNode'
import { useCompletedCerts } from '@/components/progress/useCompletedCerts'

const nodeTypes = { certNode: RoadmapNode }

// Must match buildRoadmapNodes.js: NODE_WIDTH(220) + COL_GAP(60)
const COL_GAP = 280

function computeNodesWithStatus(baseNodes, completedCerts, occupationId) {
  const completedSet = new Set(completedCerts)
  const roadmapIds = new Set(baseNodes.map(n => n.id))
  return baseNodes.map(node => {
    const { cert } = node.data
    let status
    if (completedSet.has(cert.id)) {
      status = 'completed'
    } else {
      const prereqsInRoadmap = (cert.prerequisites || []).filter(pid => roadmapIds.has(pid))
      status = prereqsInRoadmap.every(pid => completedSet.has(pid)) ? 'ready' : 'locked'
    }
    return { ...node, data: { ...node.data, status, occupationId } }
  })
}

const difficultyColors = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function RoadmapFlow({ initialNodes, initialEdges, occupationId }) {
  const completedCerts = useCompletedCerts()
  const baseNodesRef = useRef(initialNodes)

  const [nodes, setNodes, onNodesChange] = useNodesState(
    computeNodesWithStatus(initialNodes, [], occupationId)
  )
  const [edges, , onEdgesChange] = useEdgesState(
    initialEdges.map(edge => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    }))
  )

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setNodes(computeNodesWithStatus(baseNodesRef.current, completedCerts, occupationId))
  }, [completedCerts, occupationId, setNodes])

  if (isMobile) {
    // Group nodes by depth column based on x position
    const groups = {}
    nodes.forEach(node => {
      const col = Math.round(node.position.x / COL_GAP)
      if (!groups[col]) groups[col] = []
      groups[col].push(node)
    })
    const depths = Object.keys(groups).map(Number).sort((a, b) => a - b)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {depths.map((depth, i) => (
          <div key={depth}>
            {i > 0 && (
              <div style={{
                textAlign: 'center',
                color: 'var(--accent)',
                fontSize: '1.2rem',
                margin: '4px 0',
                lineHeight: 1,
              }}>
                ↓
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groups[depth].map(node => (
                <MobileCertCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '520px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2e2e3f" gap={20} />
        <Controls style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
        <MiniMap
          nodeColor="#6366f1"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        />
      </ReactFlow>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'completed') return (
    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22c55e', background: '#22c55e18', padding: '3px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
      ✓ Done
    </span>
  )
  if (status === 'ready') return (
    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6366f1', background: '#6366f118', padding: '3px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
      Ready
    </span>
  )
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg)', padding: '3px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
      Locked
    </span>
  )
}

function MobileCertCard({ node }) {
  const { cert, status, occupationId } = node.data
  const href = `/cert/${cert.id}${occupationId ? `?from=${occupationId}` : ''}`
  const borderColor = status === 'completed' ? '#22c55e' : status === 'ready' ? '#6366f1' : 'var(--border)'

  return (
    <Link href={href} style={{
      display: 'block',
      padding: '14px 16px',
      background: 'var(--surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      opacity: status === 'locked' ? 0.55 : 1,
      textDecoration: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text)', marginBottom: '3px' }}>
            {cert.name}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cert.issuer}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
        <span style={{ fontSize: '0.75rem', color: difficultyColors[cert.difficulty] || 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
          {cert.difficulty}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          ${(cert.cost || 0).toLocaleString()}
        </span>
      </div>
    </Link>
  )
}
