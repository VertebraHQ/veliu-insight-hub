import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: 'homepage',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { label: '🏠 Homepage' },
    style: {
      background: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '50%',
      width: 120,
      height: 120,
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  {
    id: 'prodotti',
    type: 'default',
    position: { x: 700, y: 150 },
    data: { label: '📦 Prodotti' },
    style: {
      background: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  {
    id: 'contatti',
    type: 'default',
    position: { x: 700, y: 450 },
    data: { label: '📞 Contatti' },
    style: {
      background: '#fce7f3',
      border: '2px solid #ec4899',
      borderRadius: '50%',
      width: 100,
      height: 100,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  {
    id: 'servizi',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { label: '🛠 Servizi' },
    style: {
      background: '#e0f2fe',
      border: '2px solid #0ea5e9',
      borderRadius: '50%',
      width: 90,
      height: 90,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  {
    id: 'chi-siamo',
    type: 'default',
    position: { x: 100, y: 400 },
    data: { label: '👥 Chi siamo' },
    style: {
      background: '#f3e8ff',
      border: '2px solid #a855f7',
      borderRadius: '50%',
      width: 90,
      height: 90,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  {
    id: 'blog',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { label: '📰 Blog' },
    style: {
      background: '#dcfce7',
      border: '2px solid #22c55e',
      borderRadius: '50%',
      width: 90,
      height: 90,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
];

const initialEdges: Edge[] = [
  // Homepage connections (thick edges - high traffic)
  {
    id: 'homepage-prodotti',
    source: 'homepage',
    target: 'prodotti',
    style: { strokeWidth: 8, stroke: '#f59e0b' },
    label: '850 percorsi',
    labelStyle: { fontSize: '10px', fontWeight: 'bold' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
    animated: true,
  },
  {
    id: 'prodotti-homepage',
    source: 'prodotti',
    target: 'homepage',
    style: { strokeWidth: 6, stroke: '#f59e0b' },
    label: '320 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'homepage-contatti',
    source: 'homepage',
    target: 'contatti',
    style: { strokeWidth: 6, stroke: '#ec4899' },
    label: '430 percorsi',
    labelStyle: { fontSize: '10px', fontWeight: 'bold' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'contatti-homepage',
    source: 'contatti',
    target: 'homepage',
    style: { strokeWidth: 4, stroke: '#ec4899' },
    label: '180 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  // Medium traffic edges
  {
    id: 'homepage-servizi',
    source: 'homepage',
    target: 'servizi',
    style: { strokeWidth: 5, stroke: '#0ea5e9' },
    label: '290 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'servizi-homepage',
    source: 'servizi',
    target: 'homepage',
    style: { strokeWidth: 3, stroke: '#0ea5e9' },
    label: '120 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'homepage-chi-siamo',
    source: 'homepage',
    target: 'chi-siamo',
    style: { strokeWidth: 4, stroke: '#a855f7' },
    label: '220 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'chi-siamo-contatti',
    source: 'chi-siamo',
    target: 'contatti',
    style: { strokeWidth: 3, stroke: '#a855f7' },
    label: '95 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  // Lower traffic edges
  {
    id: 'homepage-blog',
    source: 'homepage',
    target: 'blog',
    style: { strokeWidth: 3, stroke: '#22c55e' },
    label: '150 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'blog-prodotti',
    source: 'blog',
    target: 'prodotti',
    style: { strokeWidth: 2, stroke: '#22c55e' },
    label: '67 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'prodotti-contatti',
    source: 'prodotti',
    target: 'contatti',
    style: { strokeWidth: 4, stroke: '#f59e0b' },
    label: '185 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
  {
    id: 'servizi-chi-siamo',
    source: 'servizi',
    target: 'chi-siamo',
    style: { strokeWidth: 2, stroke: '#0ea5e9' },
    label: '45 percorsi',
    labelStyle: { fontSize: '10px' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
  },
];

export function NavigationGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] w-full bg-dashboard-surface/30 border border-dashboard-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{ backgroundColor: '#f8fafc' }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}