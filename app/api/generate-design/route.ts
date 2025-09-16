import { NextRequest, NextResponse } from 'next/server';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "INSERT_GEMINI_API_KEY_HERE";
const GEMINI_API_URL = process.env.GEMINI_API_URL || "INSERT_GEMINI_API_URL_HERE";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const SYSTEM_DESIGN_PROMPT = `You are an expert system architect. Given a user requirement, create a system design with these rules:
1. Return ONLY valid JSON in this exact format:
{
  "components": [
    {
      "id": "unique_id",
      "name": "Component Name",
      "type": "frontend|backend|database|cache|service|gateway|cdn|queue",
      "description": "Brief description",
      "position": {"x": 100, "y": 100}
    }
  ],
  "connections": [
    {
      "source": "source_component_id",
      "target": "target_component_id",
      "label": "HTTP/WebSocket/etc",
      "type": "api|data|stream"
    }
  ],
  "title": "System Design Title",
  "description": "Brief system overview"
}

2. Use realistic technology choices
3. Consider scalability for the given requirements
4. Include 4-8 main components
5. Position components in a logical layout (frontend left, databases right)`;

    const fullPrompt = `${SYSTEM_DESIGN_PROMPT}\n\nDesign a system for: ${prompt}`;
    
    // Call Gemini API directly
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const geminiResponse = await response.json();
    
    // Check if we have a valid response
    if (!geminiResponse.candidates || !geminiResponse.candidates[0] || !geminiResponse.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    // Extract the text content and remove markdown code blocks
    const rawText = geminiResponse.candidates[0].content.parts[0].text;
    const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(jsonText);

    // Validate required fields
    if (!result.components || !result.connections) {
      throw new Error('Invalid response format from AI');
    }

    // Transform AI response to React Flow compatible format
    const transformedComponents = result.components.map((component: any) => ({
      id: component.id,
      type: component.type,
      position: component.position,
      data: {
        label: component.name,
        description: component.description,
        technology: component.technology,
        componentType: component.type
      }
    }));

    const transformedConnections = result.connections.map((connection: any, index: number) => ({
      id: `e${index + 1}`,
      source: connection.source,
      target: connection.target,
      label: connection.label,
      connectionType: connection.type,
      type: 'default'
    }));

    const systemDesign = {
      components: transformedComponents,
      connections: transformedConnections,
      title: result.title || 'System Architecture',
      description: result.description || 'AI-generated system design'
    };

    return NextResponse.json(systemDesign);
  } catch (error) {
    console.error('Error generating system design:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate system design' },
      { status: 500 }
    );
  }
}

// Helper function to get component styling based on type
function getComponentStyle(type: string) {
  const styles = {
    frontend: { background: '#e3f2fd', borderColor: '#2196f3' },
    backend: { background: '#f3e5f5', borderColor: '#9c27b0' },
    service: { background: '#e8f5e8', borderColor: '#4caf50' },
    database: { background: '#fff3e0', borderColor: '#ff9800' },
    cache: { background: '#fce4ec', borderColor: '#e91e63' },
    gateway: { background: '#f1f8e9', borderColor: '#8bc34a' },
    cdn: { background: '#e0f2f1', borderColor: '#009688' },
    queue: { background: '#f3e5f5', borderColor: '#673ab7' }
  };

  const defaultStyle = { background: '#f5f5f5', borderColor: '#666' };
  return {
    ...defaultStyle,
    ...styles[type as keyof typeof styles],
    borderRadius: '8px',
    padding: '16px',
    minWidth: '140px'
  };
}
