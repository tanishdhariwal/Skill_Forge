import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  Controls,
  OnNodesChange,
  applyNodeChanges,
  MarkerType,
  Position,
} from 'reactflow';
import { BookOpen, Code, Database, Layout, Terminal, Globe, Server, FileCode, BookOpenCheck, Cloud } from 'lucide-react';
import 'reactflow/dist/style.css';

// Types for our flow data
interface FlowNode {
  _id: string;
  title: string;
  description: string;
  summary: string;
  type: "Mandatory" | "Optional";
  link: string;
  __v: number;
}

interface FlowEdge {
  from: { _id: string };
  to: { _id: string };
  label: string;
  _id: string;
}

interface FlowChartData {
  _id: string;
  title: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Sample data
const flowData: FlowChartData[] = [
  {
      "_id": "67e3ffcfdbc095d8183d6a2c",
      "title": "Full-Stack Web Development",
      "nodes": [
          {
              "_id": "67e3ffcfdbc095d8183d6a28",
              "title": "HTML & CSS Basics",
              "description": "Learn the fundamentals of web structure and styling.",
              "summary": "Covers the basics of HTML for structure and CSS for design.",
              "type": "Mandatory",
              "link": "https://www.geeksforgeeks.org/html-tutorials/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a29",
              "title": "JavaScript Basics",
              "description": "Learn JavaScript fundamentals and DOM manipulation.",
              "summary": "Introduces JavaScript syntax, variables, loops, and DOM interactions.",
              "type": "Mandatory",
              "link": "https://www.geeksforgeeks.org/javascript-tutorial/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a2a",
              "title": "React.js",
              "description": "Understand React components and state management.",
              "summary": "Explores React fundamentals, JSX, props, and state handling.",
              "type": "Optional",
              "link": "https://www.geeksforgeeks.org/reactjs-tutorials/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a2b",
              "title": "Node.js & Express",
              "description": "Learn backend development with Node.js and Express.",
              "summary": "Covers server-side development using Node.js and Express framework.",
              "type": "Mandatory",
              "link": "https://www.geeksforgeeks.org/node-js/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a2f",
              "title": "Database Management (SQL & NoSQL)",
              "description": "Understand database design, queries, and indexing.",
              "summary": "Introduces SQL and NoSQL databases, queries, and optimization.",
              "type": "Mandatory",
              "link": "https://www.geeksforgeeks.org/dbms/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a30",
              "title": "RESTful APIs & Authentication",
              "description": "Learn how to build secure APIs with JWT and OAuth.",
              "summary": "Explains API principles, JWT, OAuth, and security best practices.",
              "type": "Mandatory",
              "link": "https://www.geeksforgeeks.org/rest-api/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a31",
              "title": "GraphQL Basics",
              "description": "Understand GraphQL and its advantages over REST.",
              "summary": "Covers GraphQL schema, queries, mutations, and subscriptions.",
              "type": "Optional",
              "link": "https://www.geeksforgeeks.org/graphql/",
              "__v": 0
          },
          {
              "_id": "67e3ffcfdbc095d8183d6a32",
              "title": "DevOps & Deployment",
              "description": "Learn CI/CD, Docker, and cloud deployment strategies.",
              "summary": "Discusses CI/CD pipelines, Docker containers, and cloud deployment.",
              "type": "Optional",
              "link": "https://www.geeksforgeeks.org/devops/",
              "__v": 0
          }
      ],
      "edges": [
          { "from": { "_id": "67e3ffcfdbc095d8183d6a28" }, "to": { "_id": "67e3ffcfdbc095d8183d6a29" }, "label": "Prerequisite", "_id": "67e3ffcfdbc095d8183d6a2d" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a29" }, "to": { "_id": "67e3ffcfdbc095d8183d6a2a" }, "label": "Prerequisite", "_id": "67e3ffcfdbc095d8183d6a33" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a29" }, "to": { "_id": "67e3ffcfdbc095d8183d6a2b" }, "label": "Prerequisite", "_id": "67e3ffcfdbc095d8183d6a34" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a2b" }, "to": { "_id": "67e3ffcfdbc095d8183d6a30" }, "label": "Prerequisite", "_id": "67e3ffcfdbc095d8183d6a35" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a2b" }, "to": { "_id": "67e3ffcfdbc095d8183d6a2f" }, "label": "Corequisite", "_id": "67e3ffcfdbc095d8183d6a36" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a2f" }, "to": { "_id": "67e3ffcfdbc095d8183d6a30" }, "label": "Prerequisite", "_id": "67e3ffcfdbc095d8183d6a37" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a30" }, "to": { "_id": "67e3ffcfdbc095d8183d6a31" }, "label": "Optional Path", "_id": "67e3ffcfdbc095d8183d6a38" },
          { "from": { "_id": "67e3ffcfdbc095d8183d6a30" }, "to": { "_id": "67e3ffcfdbc095d8183d6a32" }, "label": "Corequisite", "_id": "67e3ffcfdbc095d8183d6a39" }
      ],
      "createdAt": "2025-03-26T13:23:27.244Z",
      "updatedAt": "2025-03-26T13:23:27.244Z",
      "__v": 0
  }
];

// Get icon based on node title
const getNodeIcon = (title: string) => {
  if (title.includes('HTML') || title.includes('CSS')) return FileCode;
  if (title.includes('JavaScript')) return Globe;
  if (title.includes('React')) return Layout;
  if (title.includes('Node')) return Server;
  if (title.includes('Database')) return Database;
  if (title.includes('API')) return Code;
  if (title.includes('GraphQL')) return BookOpenCheck;
  if (title.includes('DevOps')) return Cloud;
  return Terminal;
};

// Clean, sleek node component
const NodeLabel = ({ 
  icon: Icon, 
  title, 
  description, 
  type, 
  link 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  type: string;
  link: string; 
}) => (
  <div className={`flex flex-col min-w-[220px] max-w-[280px] border-l-4 ${
    type === 'Mandatory' ? 'border-l-blue-500' : 'border-l-green-500'
  } bg-slate-800 rounded overflow-hidden shadow-md`}>
    <div className="flex items-center p-3 bg-slate-900 border-b border-slate-700">
      <Icon className={`h-5 w-5 ${type === 'Mandatory' ? 'text-blue-400' : 'text-green-400'} mr-2`} />
      <h3 className="text-white text-sm font-medium flex-1 truncate">{title}</h3>
      <span className={`text-xs px-1.5 py-0.5 rounded ml-1 ${
        type === 'Mandatory' ? 'bg-blue-900/50 text-blue-300' : 'bg-green-900/50 text-green-300'
      }`}>
        {type === 'Mandatory' ? 'Core' : 'Optional'}
      </span>
    </div>
    <div className="p-3 text-xs text-slate-300">
      <p className="line-clamp-2">{description}</p>
      <a 
        href={link}
        target="_blank" 
        rel="noopener noreferrer"
        className={`mt-2 inline-block text-xs ${
          type === 'Mandatory' ? 'text-blue-400' : 'text-green-400'
        } hover:underline`}
      >
        Learn More →
      </a>
    </div>
  </div>
);

// Transform flowData to ReactFlow nodes and edges using a clean, hierarchical layout
const transformFlowData = (flowData: FlowChartData[]): { nodes: Node[], edges: Edge[] } => {
  if (!flowData.length) return { nodes: [], edges: [] };
  
  const data = flowData[0];
  
  // Create a hierarchical layout
  const levels: { [key: string]: number } = {};
  const visited = new Set<string>();
  
  // Find root nodes (those that are not targets of any edge)
  const targetNodeIds = new Set(data.edges.map(edge => edge.to._id));
  const rootNodeIds = data.nodes
    .filter(node => !targetNodeIds.has(node._id))
    .map(node => node._id);
  
  // Calculate levels using BFS
  const queue: {id: string, level: number}[] = rootNodeIds.map(id => ({id, level: 0}));
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    
    if (visited.has(id)) {
      levels[id] = Math.max(levels[id], level);
      continue;
    }
    
    visited.add(id);
    levels[id] = level;
    
    // Find all outgoing edges
    const outgoingEdges = data.edges.filter(edge => edge.from._id === id);
    for (const edge of outgoingEdges) {
      queue.push({ id: edge.to._id, level: level + 1 });
    }
  }
  
  // Count nodes at each level for horizontal positioning
  const nodesAtLevel: { [key: number]: number } = {};
  const nodePositionInLevel: { [key: string]: number } = {};
  
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!nodesAtLevel[level]) nodesAtLevel[level] = 0;
    nodePositionInLevel[nodeId] = nodesAtLevel[level];
    nodesAtLevel[level]++;
  });
  
  // Create ReactFlow nodes with clean layout
  const nodes: Node[] = data.nodes.map(node => {
    const level = levels[node._id] || 0;
    const position = nodePositionInLevel[node._id] || 0;
    const nodesInThisLevel = nodesAtLevel[level] || 1;
    
    // Space nodes evenly within their level
    const totalWidth = 1200;
    const margin = 300;
    const availableWidth = totalWidth - (2 * margin);
    
    // Calculate positions with proper spacing
    const spacing = availableWidth / (Math.max(nodesInThisLevel - 1, 1));
    const x = margin + (position * spacing);
    const y = level * 180 + 100;
    
    return {
      id: node._id,
      data: { 
        label: <NodeLabel 
          icon={getNodeIcon(node.title)} 
          title={node.title}
          description={node.description}
          type={node.type}
          link={node.link}
        />
      },
      position: { x, y },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
  
  // Create sleek edges
  const edges: Edge[] = data.edges.map(edge => {
    let edgeStyle = {
      stroke: '#3b82f6', // Default blue for prerequisite
      strokeWidth: 2,
    };
    
    // Different styling based on edge label
    if (edge.label === 'Corequisite') {
      edgeStyle.stroke = '#10b981'; // Green for corequisite
    } else if (edge.label === 'Optional Path') {
      edgeStyle.stroke = '#a855f7'; // Purple for optional
    }
    
    return {
      id: edge._id,
      source: edge.from._id,
      target: edge.to._id,
      label: edge.label,
      animated: true,
      style: edgeStyle,
      labelStyle: { 
        fill: '#f1f5f9', 
        fontSize: 12,
        fontWeight: 500,
      },
      labelBgStyle: { 
        fill: '#1e293b', 
        fillOpacity: 0.7,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [4, 2],
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeStyle.stroke,
      },
      type: 'step', // Simple step lines for cleaner appearance
    };
  });
  
  return { nodes, edges };
};

const FlowChart: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = transformFlowData(flowData);
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-20 mt-10 px-8">
      <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        {flowData.length > 0 ? flowData[0].title : "Learning Roadmap"}
      </h1>
      
      {/* Simple legend */}
      <div className="mb-6 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-300 text-sm">Core</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-slate-300 text-sm">Corequisite</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-slate-300 text-sm">Optional Path</span>
        </div>
      </div>
      
      <div className="w-full h-[1000px] bg-slate-950 rounded-lg border border-slate-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          fitView
          nodesDraggable={true}
          zoomOnScroll={true}
          className="bg-slate-950"
        >
          <Background color="#f1f5f9" variant={"dots" as any} className="bg-slate-950" gap={16} size={1} />
          <Controls className="bg-slate-900 text-white border border-slate-800" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;
