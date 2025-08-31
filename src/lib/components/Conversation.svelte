<script lang="ts">
  /**
   * Conversation.svelte
   *
   * This component handles the conversation interface between the user and the AI.
   * It displays the conversation history and allows the user to enter new prompts.
   */

  import { conversation, appStore } from '$lib/store';

  // The function to call when a new prompt is submitted
  // Using Svelte 5's $props() to access component props
  // This avoids destructuring which can cause reactivity issues
  const props = $props();

  // The current prompt input (used for submission)
  let prompt =  $state('');

  // Create a separate reactive variable to track the input value
  // This fixes a reactivity issue in Svelte 5 where the textarea binding
  // doesn't update the variable correctly when using $props()

  // Whether a prompt is currently being processed
  let isLoading = false;

  // Reference to the conversation container for auto-scrolling
  let conversationContainer: HTMLElement;

  // Handle prompt submission
  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    try {
      isLoading = true;

      // Add the user message to the conversation
      appStore.addMessage('user', prompt);

      // Call the onSubmitPrompt function with the prompt
      await props.onSubmitPrompt(prompt);

      // Clear the input value
      prompt = '';
    } catch (error) {
      console.error('Error submitting prompt:', error);
      // Add an error message to the conversation
      appStore.addMessage('assistant', `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      isLoading = false;
    }
  };

  // Auto-scroll to the bottom of the conversation when new messages are added
  $effect(() => {
    if ($conversation.length && conversationContainer) {
      setTimeout(() => {
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
      }, 0);
    }
  });

  // Clear the conversation history
  const clearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation history?')) {
      appStore.clearConversation();
    }
  };
</script>

<div class="conversation">
  <div class="conversation-header">
    <h2>Conversation</h2>
    {#if $conversation.length > 0}
      <button class="clear-button" on:click={clearConversation}>
        Clear History
      </button>
    {/if}
  </div>

  <div class="conversation-container" bind:this={conversationContainer}>
    {#if $conversation.length === 0}
      <div class="empty-conversation">
        <p>Start a conversation by entering a prompt below.</p>
        <p class="example">Example: "Create a simple todo list app with the ability to add, complete, and delete tasks."</p>
      </div>
    {:else}
      {#each $conversation as message}
        <div class="message {message.role}">
          <div class="message-header">
            <span class="role">{message.role === 'user' ? 'You' : 'AI'}</span>
            <span class="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="message-content">
            {message.content}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <form class="prompt-form" on:submit|preventDefault={handleSubmit}>
    <textarea
      class="prompt-input"
      bind:value={prompt}
      on:input={(e) => console.log('Input event:', e.target.value)}
      placeholder="Enter your prompt here..."
      rows="3"
      disabled={isLoading}
    ></textarea>

    <div style="color: #666; font-size: 12px; margin: 5px 0;">
      Debug: prompt length: {prompt.length}, trimmed length: {prompt.trim().length}, isLoading: {isLoading}
    </div>

    <button type="button" on:click={() => console.log('Current prompt:', prompt)}>
      Debug Prompt
    </button>

    <button type="submit" class="submit-button" disabled={!prompt.trim() || isLoading}>
      {isLoading ? 'Generating...' : 'Submit'}
    </button>
  </form>
</div>

<style>
  .conversation {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  .conversation-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  .clear-button {
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .clear-button:hover {
    background-color: #e63600;
  }

  .conversation-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: #f9f9f9;
  }

  .empty-conversation {
    text-align: center;
    color: #666;
    padding: 2rem 0;
  }

  .example {
    font-style: italic;
    font-size: 0.9rem;
    color: #888;
    max-width: 80%;
    margin: 0 auto;
  }

  .message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 4px;
    max-width: 85%;
  }

  .message.user {
    background-color: #e6f7ff;
    margin-left: auto;
    border-bottom-right-radius: 0;
  }

  .message.assistant {
    background-color: #f0f0f0;
    margin-right: auto;
    border-bottom-left-radius: 0;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }

  .role {
    font-weight: bold;
    color: #333;
  }

  .timestamp {
    color: #888;
  }

  .message-content {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .prompt-form {
    padding: 1rem;
    background-color: #fff;
    border-top: 1px solid #ddd;
  }

  .prompt-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #333;
  }

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
