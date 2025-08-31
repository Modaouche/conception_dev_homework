<script lang="ts">
  /**
   * ApiKeyInput.svelte
   * 
   * This component handles the input and management of the OpenAI API key.
   * It allows users to enter, save, and clear their API key, which is stored in localStorage.
   */
  
  import { apiKey, appStore } from '$lib/store';
  
  // Whether the API key is being edited
  let isEditing = false;
  
  // The current API key input value
  let apiKeyInput = $apiKey;
  
  // Whether to show the API key (or mask it)
  let showApiKey = false;
  
  // Start editing the API key
  const startEditing = () => {
    apiKeyInput = $apiKey;
    isEditing = true;
  };
  
  // Save the API key
  const saveApiKey = () => {
    appStore.setApiKey(apiKeyInput);
    isEditing = false;
    showApiKey = false;
  };
  
  // Cancel editing the API key
  const cancelEditing = () => {
    apiKeyInput = $apiKey;
    isEditing = false;
    showApiKey = false;
  };
  
  // Clear the API key
  const clearApiKey = () => {
    if (confirm('Are you sure you want to clear your API key?')) {
      appStore.setApiKey('');
      apiKeyInput = '';
      isEditing = false;
      showApiKey = false;
    }
  };
  
  // Toggle showing/hiding the API key
  const toggleShowApiKey = () => {
    showApiKey = !showApiKey;
  };
</script>

<div class="api-key-container">
  <h2>OpenAI API Key</h2>
  
  <p class="description">
    Your API key is required to generate Svelte code. It's stored locally in your browser and never sent to our servers.
    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
      Get an API key from OpenAI
    </a>
  </p>
  
  {#if isEditing}
    <div class="edit-mode">
      <input
        type={showApiKey ? 'text' : 'password'}
        bind:value={apiKeyInput}
        placeholder="Enter your OpenAI API key"
        class="api-key-input"
      />
      
      <div class="button-row">
        <button class="show-button" on:click={toggleShowApiKey}>
          {showApiKey ? 'Hide' : 'Show'}
        </button>
        
        <div class="action-buttons">
          <button class="cancel-button" on:click={cancelEditing}>
            Cancel
          </button>
          <button class="save-button" on:click={saveApiKey} disabled={!apiKeyInput.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="view-mode">
      {#if $apiKey}
        <div class="api-key-display">
          <span class="api-key-mask">
            {showApiKey ? $apiKey : '•'.repeat(Math.min(24, $apiKey.length))}
          </span>
          
          <div class="button-row">
            <button class="show-button" on:click={toggleShowApiKey}>
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            
            <div class="action-buttons">
              <button class="edit-button" on:click={startEditing}>
                Edit
              </button>
              <button class="clear-button" on:click={clearApiKey}>
                Clear
              </button>
            </div>
          </div>
        </div>
      {:else}
        <button class="add-button" on:click={startEditing}>
          Add API Key
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .api-key-container {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: #333;
  }
  
  .description {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .description a {
    color: #ff3e00;
    text-decoration: none;
  }
  
  .description a:hover {
    text-decoration: underline;
  }
  
  .edit-mode, .view-mode {
    margin-top: 0.5rem;
  }
  
  .api-key-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .api-key-display {
    padding: 0.75rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  
  .api-key-mask {
    font-family: monospace;
    letter-spacing: 0.1em;
  }
  
  .button-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .show-button {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .show-button:hover {
    background-color: #e0e0e0;
  }
  
  .add-button, .save-button {
    background-color: #4a4a4a;
    color: white;
    width: 100%;
    padding: 0.75rem;
  }
  
  .add-button:hover, .save-button:hover:not(:disabled) {
    background-color: #333;
  }
  
  .edit-button {
    background-color: #4a4a4a;
    color: white;
  }
  
  .edit-button:hover {
    background-color: #333;
  }
  
  .clear-button, .cancel-button {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .clear-button:hover, .cancel-button:hover {
    background-color: #e0e0e0;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>