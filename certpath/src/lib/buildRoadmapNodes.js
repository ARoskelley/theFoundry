import { getCert } from './getCert'

/**
 * Takes an array of cert IDs from an occupation and builds
 * React Flow nodes + edges to render the roadmap flowchart.
 *
 * Each cert becomes a node. prerequisite relationships become edges.
 * Nodes are laid out in columns by their "depth" in the chain.
 */
export function buildRoadmapNodes(certIds) {
  const certMap = new Map()

  function collectCert(id) {
    if (!id || certMap.has(id)) return

    const cert = getCert(id)
    if (!cert) return

    certMap.set(id, cert)
    ;(cert.prerequisites || []).forEach(collectCert)
  }

  ;(certIds || []).forEach(collectCert)

  const certs = Array.from(certMap.values())
  const certIdsInRoadmap = new Set(certMap.keys())

  // Calculate depth of each cert in the chain (0 = no prerequisites)
  const depthMap = {}
  const visiting = new Set()

  function getDepth(cert) {
    if (depthMap[cert.id] !== undefined) return depthMap[cert.id]
    if (visiting.has(cert.id)) return 0

    visiting.add(cert.id)

    if (!cert.prerequisites || cert.prerequisites.length === 0) {
      depthMap[cert.id] = 0
      visiting.delete(cert.id)
      return 0
    }

    const prereqDepths = cert.prerequisites.map(pid => {
      const prereqCert = getCert(pid)
      return prereqCert ? getDepth(prereqCert) + 1 : 0
    })

    depthMap[cert.id] = Math.max(...prereqDepths)
    visiting.delete(cert.id)
    return depthMap[cert.id]
  }

  certs.forEach(cert => getDepth(cert))

  const requestedOrder = new Map((certIds || []).map((id, index) => [id, index]))
  certs.sort((a, b) => {
    const depthDiff = (depthMap[a.id] || 0) - (depthMap[b.id] || 0)
    if (depthDiff !== 0) return depthDiff

    const requestedDiff =
      (requestedOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (requestedOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)

    if (requestedDiff !== 0) return requestedDiff

    return a.name.localeCompare(b.name)
  })

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
  const COL_GAP = NODE_WIDTH + 60
  const ROW_GAP = NODE_HEIGHT + 40

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
        // Only draw edge if the prerequisite exists in the expanded roadmap.
        if (certIdsInRoadmap.has(prereqId)) {
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
