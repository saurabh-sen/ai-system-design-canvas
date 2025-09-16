# AI System Design Canvas

An AI-powered system design diagram generator built with Next.js, React, and TypeScript. This application allows users to input natural language prompts describing system architectures and generates interactive visual diagrams.

## Features

- **Natural Language Input**: Describe your system architecture in plain English
- **AI-Powered Generation**: Generate system diagrams based on your prompts
- **Interactive Canvas**: Drag and drop nodes, select components, and visualize connections
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS styling

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-system-design-canvas
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter a Prompt**: Use the left panel to describe the system you want to design
2. **Generate Diagram**: Click "Generate Diagram" to create your system architecture
3. **Interact with Canvas**: 
   - Drag nodes to reposition them
   - Click nodes to select them
   - View connections between components
4. **Example Prompts**: Use the provided examples to get started quickly

### Example Prompts

- "Design a microservices architecture for an e-commerce platform with user authentication, product catalog, and order management"
- "Create a system design for a real-time chat application supporting millions of concurrent users"
- "Design a scalable video streaming service with CDN integration and adaptive bitrate streaming"
- "Architect a social media platform with news feed, user profiles, and content recommendation system"

## Architecture

The application consists of three main components:

1. **Main Page** (`app/page.tsx`): Orchestrates the overall layout and state
2. **Prompt Input** (`app/components/PromptInput.tsx`): Handles user input and prompt submission
3. **System Design Canvas** (`app/components/SystemDesignCanvas.tsx`): Renders the interactive diagram

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Canvas**: Custom SVG-based implementation (ready for React Flow integration)

## Future Enhancements

- [ ] Integrate with actual AI APIs (OpenAI, Anthropic, etc.)
- [ ] Add React Flow for advanced diagram interactions
- [ ] Implement diagram export functionality (PNG, SVG, PDF)
- [ ] Add more system component types and templates
- [ ] Support for collaborative editing
- [ ] Diagram validation and optimization suggestions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
