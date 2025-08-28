import { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Node data with pages and emojis
const initialNodes: Node[] = [
  {
    id: 'homepage',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { label: '🏠 Homepage' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--analytics-blue))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
  {
    id: 'prodotti',
    type: 'default',
    position: { x: 200, y: 200 },
    data: { label: '📦 Prodotti' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--analytics-orange))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
  {
    id: 'contatti',
    type: 'default',
    position: { x: 600, y: 200 },
    data: { label: '📞 Contatti' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--analytics-green))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
  {
    id: 'servizi',
    type: 'default',
    position: { x: 100, y: 350 },
    data: { label: '🛠 Servizi' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--analytics-red))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
  {
    id: 'chi-siamo',
    type: 'default',
    position: { x: 400, y: 350 },
    data: { label: '👥 Chi siamo' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
  {
    id: 'blog',
    type: 'default',
    position: { x: 700, y: 350 },
    data: { label: '📰 Blog' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--muted))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px',
      width: '120px',
      textAlign: 'center',
    },
  },
];

// Edges with different stroke widths based on traffic
const initialEdges: Edge[] = [
  // Homepage connections (high traffic)
  {
    id: 'homepage-prodotti',
    source: 'homepage',
    target: 'prodotti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-blue))', strokeWidth: 8 },
    label: '↔ 850',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
    animated: true,
  },
  {
    id: 'homepage-contatti',
    source: 'homepage',
    target: 'contatti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-green))', strokeWidth: 6 },
    label: '↔ 620',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  {
    id: 'homepage-chi-siamo',
    source: 'homepage',
    target: 'chi-siamo',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-orange))', strokeWidth: 5 },
    label: '↔ 450',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  
  // Prodotti connections (medium traffic)
  {
    id: 'prodotti-servizi',
    source: 'prodotti',
    target: 'servizi',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-red))', strokeWidth: 4 },
    label: '↔ 320',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  {
    id: 'prodotti-contatti',
    source: 'prodotti',
    target: 'contatti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-blue))', strokeWidth: 7 },
    label: '↔ 750',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
    animated: true,
  },
  
  // Chi siamo connections (low-medium traffic)
  {
    id: 'chi-siamo-contatti',
    source: 'chi-siamo',
    target: 'contatti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-green))', strokeWidth: 3 },
    label: '↔ 280',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  {
    id: 'chi-siamo-blog',
    source: 'chi-siamo',
    target: 'blog',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
    label: '↔ 150',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  
  // Blog connections (low traffic)
  {
    id: 'blog-homepage',
    source: 'blog',
    target: 'homepage',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-orange))', strokeWidth: 3 },
    label: '↔ 240',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  {
    id: 'blog-prodotti',
    source: 'blog',
    target: 'prodotti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
    label: '↔ 180',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
  
  // Servizi connections
  {
    id: 'servizi-contatti',
    source: 'servizi',
    target: 'contatti',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--analytics-red))', strokeWidth: 4 },
    label: '↔ 380',
    labelStyle: { fontSize: '12px', fontWeight: '600' },
  },
];

interface NavigationGraphProps {
  className?: string;
}

export function NavigationGraph({ className }: NavigationGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className={`h-[600px] w-full bg-dashboard-surface/30 border border-dashboard-border ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        style={{ background: 'hsl(var(--dashboard-surface) / 0.3)' }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background color="hsl(var(--muted-foreground) / 0.1)" />
        <Controls className="text-foreground" />
        <MiniMap 
          nodeColor="hsl(var(--analytics-blue))"
          nodeStrokeColor="hsl(var(--dashboard-border))"
          maskColor="hsl(var(--background) / 0.8)"
          className="bg-dashboard-surface border border-dashboard-border"
        />
      </ReactFlow>
    </div>
  );
}