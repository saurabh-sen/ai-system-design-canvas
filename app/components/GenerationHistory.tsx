'use client';

import { useSystemDesignStore } from '../../store/useSystemDesignStore';

export default function GenerationHistory() {
  const { generationHistory, setPrompt, setNodes, setEdges } = useSystemDesignStore();

  const loadHistoryItem = (historyItem: any) => {
    setPrompt(historyItem.prompt);
    setNodes(historyItem.schema.components);
    setEdges(historyItem.schema.connections);
  };

  if (generationHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Generation History
      </h3>
      <div className="space-y-3">
        {generationHistory.map((item) => (
          <div
            key={item.id}
            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => loadHistoryItem(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.schema.title || 'System Design'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.timestamp.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {item.schema.description}
                </p>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                {item.schema.components.length} components
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
