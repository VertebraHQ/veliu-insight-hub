import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: 'homepage',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { label: '🏠 Homepage' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'prodotti',
    type: 'default', 
    position: { x: 700, y: 150 },
    data: { label: '📦 Prodotti' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 90,
      height: 90,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'contatti',
    type: 'default',
    position: { x: 700, y: 450 },
    data: { label: '📞 Contatti' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 90,
      height: 90,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'servizi',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { label: '🛠 Servizi' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 85,
      height: 85,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'chisiamo',
    type: 'default',
    position: { x: 100, y: 400 },
    data: { label: '👥 Chi siamo' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 85,
      height: 85,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'blog',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { label: '📰 Blog' },
    style: {
      background: 'hsl(var(--dashboard-surface))',
      border: '2px solid hsl(var(--dashboard-border))',
      borderRadius: '50%',
      width: 80,
      height: 80,
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground))',
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  // Homepage connections (high traffic)
  {
    id: 'homepage-prodotti',
    source: 'homepage',
    target: 'prodotti',
    type: 'smoothstep',
    style: { strokeWidth: 6, stroke: 'hsl(var(--analytics-orange))' },
    label: '245 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'prodotti-homepage',
    source: 'prodotti',
    target: 'homepage',
    type: 'smoothstep',
    style: { strokeWidth: 4, stroke: 'hsl(var(--analytics-orange))' },
    label: '180 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'homepage-contatti',
    source: 'homepage',
    target: 'contatti',
    type: 'smoothstep',
    style: { strokeWidth: 5, stroke: 'hsl(var(--analytics-blue))' },
    label: '198 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'contatti-homepage',
    source: 'contatti',
    target: 'homepage',
    type: 'smoothstep',
    style: { strokeWidth: 3, stroke: 'hsl(var(--analytics-blue))' },
    label: '156 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'homepage-servizi',
    source: 'homepage',
    target: 'servizi',
    type: 'smoothstep',
    style: { strokeWidth: 4, stroke: 'hsl(var(--analytics-green))' },
    label: '167 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'servizi-homepage',
    source: 'servizi',
    target: 'homepage',
    type: 'smoothstep',
    style: { strokeWidth: 3, stroke: 'hsl(var(--analytics-green))' },
    label: '134 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'homepage-chisiamo',
    source: 'homepage',
    target: 'chisiamo',
    type: 'smoothstep',
    style: { strokeWidth: 3, stroke: 'hsl(var(--analytics-purple))' },
    label: '123 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'chisiamo-homepage',
    source: 'chisiamo',
    target: 'homepage',
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: 'hsl(var(--analytics-purple))' },
    label: '89 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'homepage-blog',
    source: 'homepage',
    target: 'blog',
    type: 'smoothstep',
    style: { strokeWidth: 3, stroke: 'hsl(var(--analytics-red))' },
    label: '112 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'blog-homepage',
    source: 'blog',
    target: 'homepage',
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: 'hsl(var(--analytics-red))' },
    label: '78 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  // Cross connections (medium/low traffic)
  {
    id: 'prodotti-contatti',
    source: 'prodotti',
    target: 'contatti',
    type: 'smoothstep',
    style: { strokeWidth: 3, stroke: 'hsl(var(--analytics-blue))' },
    label: '87 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'blog-prodotti',
    source: 'blog',
    target: 'prodotti',
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: 'hsl(var(--analytics-orange))' },
    label: '65 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'chisiamo-contatti',
    source: 'chisiamo',
    target: 'contatti',
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: 'hsl(var(--analytics-green))' },
    label: '54 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
  {
    id: 'servizi-prodotti',
    source: 'servizi',
    target: 'prodotti',
    type: 'smoothstep',
    style: { strokeWidth: 2, stroke: 'hsl(var(--analytics-purple))' },
    label: '43 utenti',
    labelStyle: { fontSize: '10px', fontFamily: 'monospace' },
  },
];

export function NavigationGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[500px] bg-dashboard-surface/20 border border-dashboard-border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        style={{ 
          backgroundColor: "hsl(var(--dashboard-surface) / 0.1)",
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls />
        <Background 
          color="hsl(var(--dashboard-border))" 
          gap={20} 
          size={1} 
        />
      </ReactFlow>
    </div>
  );
}