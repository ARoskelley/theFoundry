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
import RoadmapNode from './RoadmapNode'

// Register custom node types
const nodeTypes = {
  certNode: RoadmapNode,
}

export default function RoadmapFlow({ initialNodes, initialEdges }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(
    initialEdges.map(edge => ({
      ...edge,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      },
    }))
  )

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
