'use client';

import { useSystemDesignStore } from '../../store/useSystemDesignStore';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export default function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const { prompt, setPrompt } = useSystemDesignStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  const examplePrompts = [
    "Design a microservices architecture for an e-commerce platform with user authentication, product catalog, and order management",
    "Create a system design for a real-time chat application supporting millions of concurrent users",
    "Design a scalable video streaming service with CDN integration and adaptive bitrate streaming",
    "Architect a social media platform with news feed, user profiles, and content recommendation system"
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Describe Your System
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            System Design Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the system you want to design... (e.g., Design a microservices architecture for an e-commerce platform)"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            'Generate Diagram'
          )}
        </button>
      </form>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Example Prompts</h4>
        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="block w-full text-left text-xs text-gray-600 hover:text-gray-900 p-2 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
