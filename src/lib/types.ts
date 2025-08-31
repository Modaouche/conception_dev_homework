/**
 * types.ts
 * 
 * This file contains TypeScript type definitions used throughout the application.
 * These types help ensure type safety and provide better code documentation.
 */

/**
 * Represents a generated Svelte component
 */
export interface GeneratedComponent {
  id: string;           // Unique identifier for the component
  code: string;         // The Svelte code as a string
  prompt: string;       // The prompt that generated this component
  timestamp: number;    // When the component was generated
}

/**
 * Represents a message in the conversation history
 */
export interface ConversationMessage {
  id: string;           // Unique identifier for the message
  role: 'user' | 'assistant'; // Who sent the message
  content: string;      // The content of the message
  timestamp: number;    // When the message was sent
}

/**
 * Represents the application state that needs to be persisted
 */
export interface AppState {
  apiKey: string;                       // The user's OpenAI API key
  components: GeneratedComponent[];     // History of generated components
  currentComponentId: string | null;    // ID of the currently displayed component
  conversation: ConversationMessage[];  // Conversation history
}