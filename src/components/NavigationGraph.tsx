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
    position: { x: 350, y: 250 },
    data: { label: '🏠 Homepage' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 120,
      height: 120,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    id: 'blog',
    type: 'default',
    position: { x: 350, y: 50 },
    data: { label: '📰 Blog' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    id: 'prodotti',
    type: 'default', 
    position: { x: 600, y: 150 },
    data: { label: '📦 Prodotti' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    id: 'contatti',
    type: 'default',
    position: { x: 600, y: 350 },
    data: { label: '📞 Contatti' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    id: 'chisiamo',
    type: 'default',
    position: { x: 100, y: 350 },
    data: { label: '👥 Chi siamo' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  {
    id: 'servizi',
    type: 'default',
    position: { x: 100, y: 150 },
    data: { label: '🛠 Servizi' },
    style: {
      background: '#2a2a2a',
      border: '2px solid #444',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
];

const initialEdges: Edge[] = [
  // Homepage to all pages (main connections)
  {
    id: 'homepage-blog',
    source: 'homepage',
    target: 'blog',
    type: 'straight',
    style: { strokeWidth: 4, stroke: '#ff6b35' },
  },
  {
    id: 'blog-homepage',
    source: 'blog',
    target: 'homepage',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'homepage-prodotti',
    source: 'homepage',
    target: 'prodotti',
    type: 'straight',
    style: { strokeWidth: 5, stroke: '#ff6b35' },
  },
  {
    id: 'prodotti-homepage',
    source: 'prodotti',
    target: 'homepage',
    type: 'straight',
    style: { strokeWidth: 4, stroke: '#ff6b35' },
  },
  {
    id: 'homepage-contatti',
    source: 'homepage',
    target: 'contatti',
    type: 'straight',
    style: { strokeWidth: 4, stroke: '#ff6b35' },
  },
  {
    id: 'contatti-homepage',
    source: 'contatti',
    target: 'homepage',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'homepage-chisiamo',
    source: 'homepage',
    target: 'chisiamo',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'chisiamo-homepage',
    source: 'chisiamo',
    target: 'homepage',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'homepage-servizi',
    source: 'homepage',
    target: 'servizi',
    type: 'straight',
    style: { strokeWidth: 4, stroke: '#ff6b35' },
  },
  {
    id: 'servizi-homepage',
    source: 'servizi',
    target: 'homepage',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  
  // Cross connections
  {
    id: 'blog-prodotti',
    source: 'blog',
    target: 'prodotti',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'prodotti-blog',
    source: 'prodotti',
    target: 'blog',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'blog-servizi',
    source: 'blog',
    target: 'servizi',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'servizi-blog',
    source: 'servizi',
    target: 'blog',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'prodotti-contatti',
    source: 'prodotti',
    target: 'contatti',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'contatti-prodotti',
    source: 'contatti',
    target: 'prodotti',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'contatti-chisiamo',
    source: 'contatti',
    target: 'chisiamo',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'chisiamo-contatti',
    source: 'chisiamo',
    target: 'contatti',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'chisiamo-servizi',
    source: 'chisiamo',
    target: 'servizi',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'servizi-chisiamo',
    source: 'servizi',
    target: 'chisiamo',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
  },
  {
    id: 'servizi-prodotti',
    source: 'servizi',
    target: 'prodotti',
    type: 'straight',
    style: { strokeWidth: 3, stroke: '#ff6b35' },
  },
  {
    id: 'prodotti-servizi',
    source: 'prodotti',
    target: 'servizi',
    type: 'straight',
    style: { strokeWidth: 2, stroke: '#ff6b35' },
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
    <div className="h-[500px] bg-black border border-dashboard-border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        style={{ 
          backgroundColor: "#000000",
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
      >
      </ReactFlow>
    </div>
  );
}