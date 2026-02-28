import { getCert } from './getCert'

/**
 * Takes an array of cert IDs from an occupation and builds
 * React Flow nodes + edges to render the roadmap flowchart.
 *
 * Each cert becomes a node. prerequisite relationships become edges.
 * Nodes are laid out in columns by their "depth" in the chain.
 */
export function buildRoadmapNodes(certIds) {
  const certs = certIds.map(id => getCert(id)).filter(Boolean)

  // Calculate depth of each cert in the chain (0 = no prerequisites)
  const depthMap = {}

  function getDepth(cert) {
    if (depthMap[cert.id] !== undefined) return depthMap[cert.id]
    if (!cert.prerequisites || cert.prerequisites.length === 0) {
      depthMap[cert.id] = 0
      return 0
    }
    const prereqDepths = cert.prerequisites.map(pid => {
      const prereqCert = getCert(pid)
      return prereqCert ? getDepth(prereqCert) + 1 : 0
    })
    depthMap[cert.id] = Math.max(...prereqDepths)
    return depthMap[cert.id]
  }

  certs.forEach(cert => getDepth(cert))

  // Group certs by depth column
  const columns = {}
  certs.forEach(cert => {
    const depth = depthMap[cert.id] || 0
    if (!columns[depth]) columns[depth] = []
    columns[depth].push(cert)
  })

  // Build React Flow nodes
  const NODE_WIDTH = 220
  const NODE_HEIGHT = 80
  const COL_GAP = 280
  const ROW_GAP = 120

  const nodes = certs.map(cert => {
    const col = depthMap[cert.id] || 0
    const row = columns[col].indexOf(cert)
    return {
      id: cert.id,
      type: 'certNode', // custom node type defined in RoadmapNode.jsx
      position: {
        x: col * COL_GAP,
        y: row * ROW_GAP,
      },
      data: {
        cert,
      },
    }
  })

  // Build React Flow edges from prerequisite relationships
  const edges = []
  certs.forEach(cert => {
    if (cert.prerequisites) {
      cert.prerequisites.forEach(prereqId => {
        // Only draw edge if prereq is in our cert list
        if (certIds.includes(prereqId)) {
          edges.push({
            id: `${prereqId}->${cert.id}`,
            source: prereqId,
            target: cert.id,
            animated: true,
            style: { stroke: '#6366f1' },
          })
        }
      })
    }
  })

  return { nodes, edges }
}
