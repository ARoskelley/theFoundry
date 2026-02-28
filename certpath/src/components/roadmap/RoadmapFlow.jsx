'use client'
import ReactFlow, {
  Background,
  Controls,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

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
