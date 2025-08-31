/**
 * openai-service.ts
 * 
 * This file contains the service for interacting with the OpenAI API.
 * It handles sending prompts to the API and processing the responses.
 */

import OpenAI from 'openai';
import { get } from 'svelte/store';
import { apiKey } from './store';

/**
 * Creates a system prompt that instructs the AI to generate Svelte code
 */
const createSystemPrompt = (): string => {
  return `
You are an expert Svelte developer. Your task is to generate clean, functional Svelte code based on user prompts.

Guidelines:
1. Generate ONLY valid Svelte code (.svelte file content)
2. Include necessary script tags, markup, and style tags as needed
3. Use Svelte's reactive syntax appropriately
4. Keep the code clean, readable, and well-commented
5. Do not include any explanations outside the code - ONLY return the Svelte code itself
6. Make sure the code is complete and can run on its own
7. Use Svelte's built-in features rather than external libraries when possible

Example of good response format:
<script>
  // Component state and logic here
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

<main>
  <!-- Component markup here -->
  <h1>Counter: {count}</h1>
  <button on:click={increment}>Increment</button>
</main>

<style>
  /* Component styles here */
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  h1 {
    color: #ff3e00;
  }
</style>
`;
};

/**
 * Cleans the generated code by removing markdown code block syntax
 * 
 * @param code The code that might contain markdown code block syntax
 * @returns The cleaned code without markdown syntax
 */
const cleanGeneratedCode = (code: string): string => {
  // Check if the code is wrapped in markdown code blocks
  const markdownRegex = /^```(?:html|svelte)?\s*\n([\s\S]*?)```$/;
  const match = code.match(markdownRegex);

  // If it's wrapped in markdown code blocks, extract the actual code
  if (match && match[1]) {
    return match[1];
  }

  // Otherwise, return the original code
  return code;
};

/**
 * Generates Svelte code from a natural language prompt using OpenAI
 *
 * @param prompt The user's natural language prompt
 * @param conversationHistory Previous messages in the conversation
 * @returns The generated Svelte code
 */
export const generateSvelteCode = async (
  prompt: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> => {
  const currentApiKey = get(apiKey);

  if (!currentApiKey) {
    throw new Error('OpenAI API key is required');
  }

  // Initialize the OpenAI client with the user's API key
  const openai = new OpenAI({
    apiKey: currentApiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });

  try {
    // Prepare the messages for the API call
    const messages = [
      { role: 'system', content: createSystemPrompt() },
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo for free tier generation
      messages: messages as any, // Type assertion needed due to OpenAI types
      temperature: 0.7, // Balanced between creativity and consistency
      max_tokens: 2000 // Allow for reasonably complex components
    });

    // Extract the generated code from the response
    const generatedCode = response.choices[0]?.message?.content || '';

    // Clean the generated code by removing markdown code block syntax
    const cleanedCode = cleanGeneratedCode(generatedCode);

    return cleanedCode;
  } catch (error) {
    console.error('Error generating Svelte code:', error);
    throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : String(error)}`);
  }
};
