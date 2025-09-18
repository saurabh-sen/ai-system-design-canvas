'use client';

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSystemDesignStore, SystemComponent, SystemConnection } from '../../store/useSystemDesignStore';
import CustomNode from './CustomNode';

interface SystemDesignCanvasProps {
  prompt: string;
  isGenerating: boolean;
}

// Define node and edge types
const nodeTypes: NodeTypes = {
  frontend: CustomNode,
  backend: CustomNode,
  database: CustomNode,
  cache: CustomNode,
  service: CustomNode,
  gateway: CustomNode,
  cdn: CustomNode,
  queue: CustomNode,
};

// Inner component that uses React Flow hooks
function SystemDesignCanvasInner({ prompt, isGenerating }: SystemDesignCanvasProps) {
  const { 
    nodes, 
    edges, 
    selectedNode, 
    updateNodePosition, 
    selectNode,
    error,
    resetCanvas,
    applyAutoLayout,
    setViewport,
    viewport
  } = useSystemDesignStore();

  const [isFullScreen, setIsFullScreen] = useState(false);

  const reactFlowInstance = useReactFlow();

  // Full screen functionality
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen]);

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullScreen]);

  // Handle click outside to exit full screen
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsFullScreen(false);
    }
  }, []);

  // Auto-fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
      }, 200);
    }
  }, [nodes.length, reactFlowInstance]);

  // Convert store nodes to React Flow format
  const reactFlowNodes = useMemo(() => 
    nodes.map(node => ({
      ...node,
      selected: selectedNode === node.id,
      style: {
        ...node.style,
        transition: 'all 0.3s ease-in-out'
      }
    })), [nodes, selectedNode]
  );

  // Convert store edges to React Flow format
  const reactFlowEdges = useMemo(() => 
    edges.map(edge => ({
      ...edge,
      animated: true,
      style: { 
        stroke: '#666', 
        strokeWidth: 2,
        strokeDasharray: edge.connectionType === 'data' ? '5,5' : 'none'
      },
      labelStyle: { 
        fill: '#666', 
        fontSize: 11,
        fontWeight: 500,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 6px',
        borderRadius: '4px'
      },
      markerEnd: {
        type: 'arrowclosed' as const,
        color: '#666',
        width: 20,
        height: 20
      }
    })), [edges]
  );

  const onNodesChange = useCallback((changes: any) => {
    // Handle node changes (position updates, selection, etc.)
    changes.forEach((change: any) => {
      if (change.type === 'position' && change.position) {
        updateNodePosition(change.id, change.position);
      }
      if (change.type === 'select') {
        selectNode(change.selected ? change.id : null);
      }
    });
  }, [updateNodePosition, selectNode]);

  const onEdgesChange = useCallback((changes: any) => {
    // Handle edge changes if needed
  }, []);

  const onConnect = useCallback((params: Connection) => {
    // Handle new connections if needed
  }, []);

  const onInit = useCallback((instance: any) => {
    // Initialize React Flow instance
    if (viewport) {
      instance.setViewport({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
    } else {
      // Auto-fit view when first loading
      setTimeout(() => {
        instance.fitView({ padding: 0.1, duration: 800 });
      }, 100);
    }
  }, [viewport]);

  const onMove = useCallback((event: any, viewport: any) => {
    setViewport(viewport);
  }, [setViewport]);

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No System Design Prompt
          </h3>
          <p className="text-gray-500">
            Enter a prompt on the left to generate your system architecture diagram
          </p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Generating Your Diagram
          </h3>
          <p className="text-gray-500">
            AI is analyzing your prompt and creating the system architecture...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Generation Failed
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${isFullScreen ? 'fixed inset-0 z-50' : 'h-full w-full'} bg-gray-50 ${isFullScreen ? 'p-0' : 'p-4'}`}
      onClick={isFullScreen ? handleOverlayClick : undefined}
    >
      <div 
        className={`bg-white ${isFullScreen ? 'rounded-none shadow-none border-0' : 'rounded-lg shadow-sm border border-gray-200'} h-full overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Canvas Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">System Architecture</h4>
            <div className="flex space-x-2">
              <button 
                onClick={toggleFullScreen}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1"
                title={isFullScreen ? "Exit Full Screen" : "Preview Full Screen"}
              >
                {isFullScreen ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                    </svg>
                    Exit Full Screen
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Full Screen
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  applyAutoLayout();
                  // Auto-fit view after layout
                  setTimeout(() => {
                    reactFlowInstance?.fitView({ padding: 0.1, duration: 800 });
                  }, 100);
                }}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Reorganize Layout
              </button>
              <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                Export
              </button>
              <button 
                onClick={resetCanvas}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="h-full">
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onMove={onMove}
            nodeTypes={nodeTypes}
            attributionPosition="bottom-left"
            className="bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <Background color="#e5e7eb" gap={20} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                const type = node.data?.componentType;
                const colors = {
                  frontend: '#2196f3',
                  backend: '#9c27b0',
                  service: '#4caf50',
                  database: '#ff9800',
                  cache: '#e91e63',
                  gateway: '#8bc34a',
                  cdn: '#009688',
                  queue: '#673ab7'
                };
                return colors[type as keyof typeof colors] || '#666';
              }}
              nodeStrokeWidth={3}
              nodeBorderRadius={8}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {/* Canvas Footer */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Components: {nodes.length}</span>
            <span>Connections: {edges.length}</span>
            <span>Generated from AI prompt</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped with ReactFlowProvider
export default function SystemDesignCanvas(props: SystemDesignCanvasProps) {
  return (
    <ReactFlowProvider>
      <SystemDesignCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
