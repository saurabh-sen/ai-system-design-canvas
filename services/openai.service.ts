// Service to call our Next.js API route for system design generation
export const generateSystemDesign = async (prompt: string) => {
  const response = await fetch('/api/generate-design', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate system design');
  }

  return response.json();
};