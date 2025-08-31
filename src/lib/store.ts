/**
 * store.ts
 * 
 * This file contains the Svelte stores that manage the application state.
 * It handles persisting the state to localStorage and provides reactive access to the state.
 */

import { writable, derived, get } from 'svelte/store';
import type { AppState, GeneratedComponent, ConversationMessage } from './types';
import { browser } from '$app/environment';

// Generate a unique ID for components and messages
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initialize the app state from localStorage or with default values
const initializeState = (): AppState => {
  if (browser) {
    const savedState = localStorage.getItem('lovableAppState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
  }
  
  // Default state if nothing is saved or we're not in a browser
  return {
    apiKey: '',
    components: [],
    currentComponentId: null,
    conversation: []
  };
};

// Create the main store
const createAppStore = () => {
  const { subscribe, set, update } = writable<AppState>(initializeState());
  
  // Save to localStorage whenever the state changes
  subscribe(state => {
    if (browser) {
      localStorage.setItem('lovableAppState', JSON.stringify(state));
    }
  });
  
  return {
    subscribe,
    
    // Set the API key
    setApiKey: (apiKey: string) => {
      update(state => ({ ...state, apiKey }));
    },
    
    // Add a new component to the history
    addComponent: (code: string, prompt: string) => {
      const newComponent: GeneratedComponent = {
        id: generateId(),
        code,
        prompt,
        timestamp: Date.now()
      };
      
      update(state => {
        const newState = { 
          ...state, 
          components: [...state.components, newComponent],
          currentComponentId: newComponent.id
        };
        return newState;
      });
      
      return get({ subscribe }).currentComponentId;
    },
    
    // Set the current component by ID
    setCurrentComponent: (id: string) => {
      update(state => ({ ...state, currentComponentId: id }));
    },
    
    // Add a message to the conversation
    addMessage: (role: 'user' | 'assistant', content: string) => {
      const newMessage: ConversationMessage = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now()
      };
      
      update(state => ({
        ...state,
        conversation: [...state.conversation, newMessage]
      }));
    },
    
    // Clear the conversation history
    clearConversation: () => {
      update(state => ({ ...state, conversation: [] }));
    }
  };
};

// Create the main app store
export const appStore = createAppStore();

// Derived stores for convenience
export const apiKey = derived(appStore, $state => $state.apiKey);
export const components = derived(appStore, $state => $state.components);
export const currentComponentId = derived(appStore, $state => $state.currentComponentId);
export const conversation = derived(appStore, $state => $state.conversation);

// Get the current component
export const currentComponent = derived(
  [components, currentComponentId],
  ([$components, $currentComponentId]) => {
    if (!$currentComponentId) return null;
    return $components.find(c => c.id === $currentComponentId) || null;
  }
);

// Get the previous component (for undo functionality)
export const previousComponent = derived(
  [components, currentComponentId],
  ([$components, $currentComponentId]) => {
    if (!$currentComponentId || $components.length <= 1) return null;
    
    const currentIndex = $components.findIndex(c => c.id === $currentComponentId);
    if (currentIndex <= 0) return null;
    
    return $components[currentIndex - 1] || null;
  }
);