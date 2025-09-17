'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeType, SystemComponent } from '../../store/useSystemDesignStore';

// Node styling configuration
const nodeStyles: Record<NodeType, { background: string; borderColor: string; icon: string }> = {
  frontend: { 
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
    borderColor: '#2196f3',
    icon: '🖥️'
  },
  backend: { 
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', 
    borderColor: '#9c27b0',
    icon: '⚙️'
  },
  service: { 
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', 
    borderColor: '#4caf50',
    icon: '🔧'
  },
  database: { 
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)', 
    borderColor: '#ff9800',
    icon: '🗄️'
  },
  cache: { 
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)', 
    borderColor: '#e91e63',
    icon: '⚡'
  },
  gateway: { 
    background: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)', 
    borderColor: '#8bc34a',
    icon: '🚪'
  },
  cdn: { 
    background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)', 
    borderColor: '#009688',
    icon: '🌐'
  },
  queue: { 
    background: 'linear-gradient(135deg, #f3e5f5 0%, #d1c4e9 100%)', 
    borderColor: '#673ab7',
    icon: '📋'
  }
};

const CustomNode = memo(({ data, selected }: NodeProps<SystemComponent>) => {
  const { label, description, technology, componentType } = data ;
  const style = nodeStyles[componentType];

  return (
    <div 
      className={`relative min-w-[200px] min-h-[100px] rounded-lg shadow-lg border-2 transition-all duration-200 ${
        selected ? 'ring-4 ring-blue-400 ring-opacity-50 shadow-xl' : 'hover:shadow-md'
      }`}
      style={{
        background: style.background,
        borderColor: style.borderColor,
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ borderColor: style.borderColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ borderColor: style.borderColor }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ borderColor: style.borderColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ borderColor: style.borderColor }}
      />

      {/* Node content */}
      <div className="p-4 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{style.icon}</span>
          <h3 className="text-sm font-semibold text-gray-800 truncate">{label}</h3>
        </div>
        
        {description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>
        )}
        
        {technology && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
              {technology}
            </span>
          </div>
        )}
      </div>

      {/* Node type indicator */}
      <div 
        className="absolute top-2 right-2 w-2 h-2 rounded-full"
        style={{ backgroundColor: style.borderColor }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
