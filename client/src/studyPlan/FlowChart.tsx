import React from 'react';
import ReactFlow, { Node, Edge, Background, Controls } from 'reactflow';
import { BookOpen, Code, Database, Layout, FolderGit2 } from 'lucide-react';
import 'reactflow/dist/style.css';

const NodeLabel = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm">
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </div>
);

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: <NodeLabel icon={BookOpen} label="Level 1: Fundamentals" />
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { 
      label: <NodeLabel icon={Code} label="Level 2: Basic Concepts" />
    },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { 
      label: <NodeLabel icon={Database} label="Level 3: Advanced Topics" />
    },
    position: { x: 250, y: 200 },
  },
  {
    id: '4',
    data: { 
      label: <NodeLabel icon={Layout} label="Level 4: Frameworks" />
    },
    position: { x: 250, y: 300 },
  },
  {
    id: '5',
    type: 'output',
    data: { 
      label: <NodeLabel icon={FolderGit2} label="Level 5: Projects" />
    },
    position: { x: 250, y: 400 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

const FlowChart: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;
