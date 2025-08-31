# Lovable Svelte Generator

A minimal tool that transforms natural-language prompts into client-only Svelte pages, with the ability to iterate via conversation and undo previous iterations.

## Features

- **Natural Language to Svelte**: Generate Svelte components by describing what you want in plain English
- **Conversational Refinement**: Iteratively improve your components through conversation
- **Undo Functionality**: Jump back to previous versions of your generated components
- **Code Viewer**: See the generated Svelte code alongside the rendered result
- **Client-Only**: All processing happens in the browser with your own API key

## Setup

### Prerequisites

- Node.js (v18 or later recommended)
- npm or bun

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd lovable-svelte-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### API Key

This application requires an OpenAI API key to function. The key is used to generate Svelte code from your natural language prompts.

- You'll need to provide your own OpenAI API key
- The key is stored only in your browser's localStorage and never sent to any server
- You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys)

## Usage

1. Enter your OpenAI API key in the provided field
2. Type a natural language prompt describing the Svelte component you want to create
   - Example: "Create a simple todo list app with the ability to add, complete, and delete tasks"
3. Submit your prompt and wait for the component to be generated
4. View the generated component and its code
5. Refine the component by continuing the conversation
   - Example: "Add a dark mode toggle to the todo list"
6. Use the component history to navigate between different versions or undo to a previous version

## Deployment

To build the application for production:

```bash
npm run build
# or
bun run build
```

The built application will be in the `build` directory and can be deployed to any static hosting service.

## Limitations

- The quality of generated components depends on the OpenAI model's capabilities
- Complex components may require multiple iterations to refine
- The application uses the OpenAI API which has usage costs associated with it
- Generated components are limited to what can be done with client-side Svelte (no server-side functionality)
- The application requires a modern browser with JavaScript enabled

## License

[MIT](LICENSE)
