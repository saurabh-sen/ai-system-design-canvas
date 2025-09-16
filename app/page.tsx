'use client';

import { useEffect } from 'react';
import SystemDesignCanvas from './components/SystemDesignCanvas';
import PromptInput from './components/PromptInput';
import GenerationHistory from './components/GenerationHistory';
import { useSystemDesignStore, generateSystemDesign } from '@/store/useSystemDesignStore';

export default function Home() {
  const { 
    prompt, 
    isGenerating, 
    setPrompt, 
    setIsGenerating, 
    setNodes, 
    setEdges, 
    setError, 
    addToHistory,
    clearError 
  } = useSystemDesignStore();

  const handleGenerateDiagram = async (inputPrompt: string) => {
    try {
      clearError();
      setIsGenerating(true);
      setPrompt(inputPrompt);
      
      // Call the OpenAI API
      const result = await generateSystemDesign(inputPrompt);
      
      // Update the canvas with the generated diagram
      setNodes(result.components);
      setEdges(result.connections);
      
      // Add to generation history
      addToHistory(inputPrompt, result);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear any errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI System Design Canvas
          </h1>
          <p className="text-lg text-gray-600">
            Generate system architecture diagrams with AI-powered insights
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Prompt Input */}
          <div className="lg:col-span-1">
            <PromptInput 
              onGenerate={handleGenerateDiagram}
              isGenerating={isGenerating}
            />
            <GenerationHistory />
          </div>

          {/* Right Panel - Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  System Design Diagram
                </h2>
                {prompt && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Generated from: "{prompt}"
                    </p>
                  </div>
                )}
              </div>
              <div className="h-[600px] w-full">
                <SystemDesignCanvas 
                  prompt={prompt}
                  isGenerating={isGenerating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
