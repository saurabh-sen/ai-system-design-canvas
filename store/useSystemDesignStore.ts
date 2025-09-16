import { generateSystemDesign as generateSystemDesignService } from '@/services/openai.service';
import { create } from 'zustand';
import { Node, Edge, Position } from '@xyflow/react';

// React Flow node types
export type NodeType = 'frontend' | 'backend' | 'database' | 'cache' | 'service' | 'gateway' | 'cdn' | 'queue';

// React Flow compatible node structure
export interface SystemComponent extends Node {
  type: NodeType;
  data: {
    label: string;
    description: string;
    technology?: string;
    componentType: NodeType;
  };
}

// React Flow compatible edge structure
export interface SystemConnection extends Edge {
  label?: string;
  connectionType: 'api' | 'data' | 'stream';
  description?: string;
  bidirectional?: boolean;
}

export interface SystemDesignSchema {
  components: SystemComponent[];
  connections: SystemConnection[];
  title: string;
  description: string;
}

export interface SystemDesignState {
  // State
  prompt: string;
  isGenerating: boolean;
  nodes: SystemComponent[];
  edges: SystemConnection[];
  error: string | null;
  generationHistory: Array<{
    id: string;
    prompt: string;
    timestamp: Date;
    schema: SystemDesignSchema;
  }>;
  selectedNode: string | null;
  viewport: { x: number; y: number; zoom: number };

  // Actions
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setNodes: (nodes: SystemComponent[]) => void;
  setEdges: (edges: SystemConnection[]) => void;
  setError: (error: string | null) => void;
  addToHistory: (prompt: string, schema: SystemDesignSchema) => void;
  clearError: () => void;
  resetCanvas: () => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  selectNode: (nodeId: string | null) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  applyAutoLayout: () => void;
}

// Default empty state
const defaultComponents: SystemComponent[] = [];
const defaultEdges: SystemConnection[] = [];

// Improved auto-layout function with better organization
const applyAutoLayout = (nodes: SystemComponent[], edges: SystemConnection[]): SystemComponent[] => {
  if (nodes.length === 0) return nodes;

  const nodeWidth = 220;
  const nodeHeight = 120;
  const horizontalSpacing = 80;
  const verticalSpacing = 80;
  const canvasWidth = 1400;
  const canvasHeight = 900;

  // Group nodes by type for better organization
  const nodeGroups: { [key in NodeType]: SystemComponent[] } = {
    frontend: [],
    backend: [],
    database: [],
    cache: [],
    service: [],
    gateway: [],
    cdn: [],
    queue: []
  };

  nodes.forEach(node => {
    nodeGroups[node.type].push(node);
  });

  // Define logical layers for system architecture
  const layers = [
    { types: ['frontend', 'cdn'], y: 100, name: 'Presentation Layer' },
    { types: ['gateway'], y: 300, name: 'API Gateway' },
    { types: ['backend', 'service'], y: 500, name: 'Application Layer' },
    { types: ['database', 'cache', 'queue'], y: 700, name: 'Data Layer' }
  ];

  const updatedNodes: SystemComponent[] = [];

  layers.forEach((layer, layerIndex) => {
    const layerNodes: SystemComponent[] = [];
    
    // Collect all nodes for this layer
    layer.types.forEach(type => {
      layerNodes.push(...nodeGroups[type as NodeType]);
    });

    if (layerNodes.length === 0) return;

    // Calculate starting x position to center the layer
    const totalWidth = layerNodes.length * nodeWidth + (layerNodes.length - 1) * horizontalSpacing;
    const startX = Math.max(50, (canvasWidth - totalWidth) / 2);

    // Position nodes in this layer
    layerNodes.forEach((node, index) => {
      const x = startX + index * (nodeWidth + horizontalSpacing);
      const y = layer.y;
      
      updatedNodes.push({
        ...node,
        position: { x, y }
      });
    });
  });

  // Handle any remaining nodes that don't fit the layer structure
  const remainingNodes = nodes.filter(node => 
    !updatedNodes.some(updatedNode => updatedNode.id === node.id)
  );

  if (remainingNodes.length > 0) {
    // Place remaining nodes in a grid pattern
    const cols = Math.ceil(Math.sqrt(remainingNodes.length));
    const startX = 50;
    const startY = 50;
    
    remainingNodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (nodeWidth + horizontalSpacing);
      const y = startY + row * (nodeHeight + verticalSpacing);
      
      updatedNodes.push({
        ...node,
        position: { x, y }
      });
    });
  }

  return updatedNodes;
};

export const useSystemDesignStore = create<SystemDesignState>((set, get) => ({
  // Initial state
  prompt: '',
  isGenerating: false,
  nodes: defaultComponents,
  edges: defaultEdges,
  error: null,
  generationHistory: [],
  selectedNode: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  // Actions
  setPrompt: (prompt: string) => set({ prompt }),

  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

  setNodes: (nodes: SystemComponent[]) => {
    // Automatically apply layout when setting new nodes
    const layoutedNodes = applyAutoLayout(nodes, get().edges);
    set({ nodes: layoutedNodes });
  },

  setEdges: (edges: SystemConnection[]) => set({ edges }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  resetCanvas: () => set({
    nodes: defaultComponents,
    edges: defaultEdges,
    prompt: '',
    selectedNode: null,
    viewport: { x: 0, y: 0, zoom: 1 }
  }),

  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    }));
  },

  selectNode: (nodeId: string | null) => set({ selectedNode: nodeId }),

  setViewport: (viewport: { x: number; y: number; zoom: number }) => set({ viewport }),

  applyAutoLayout: () => {
    const { nodes, edges } = get();
    const layoutedNodes = applyAutoLayout(nodes, edges);
    set({ nodes: layoutedNodes });
  },

  addToHistory: (prompt: string, schema: SystemDesignSchema) => {
    const historyEntry = {
      id: Date.now().toString(),
      prompt,
      timestamp: new Date(),
      schema,
    };

    set((state) => ({
      generationHistory: [historyEntry, ...state.generationHistory.slice(0, 9)] // Keep last 10
    }));
  },
}));


// Function that calls our API route for system design generation
export const generateSystemDesign = async (prompt: string): Promise<SystemDesignSchema> => {
  try {
    const result = await generateSystemDesignService(prompt);
    return result;
  } catch (error) {
    console.error('Error generating system design:', error);
    throw error;
  }
};
