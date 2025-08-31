<script lang="ts">
  /**
   * ComponentHistory.svelte
   * 
   * This component displays the history of generated components and allows
   * users to navigate between them, implementing the undo functionality.
   */
  
  import { components, currentComponentId, appStore } from '$lib/store';
  
  // Function to format a timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Function to truncate a prompt for display
  const truncatePrompt = (prompt: string, maxLength = 50): string => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };
  
  // Function to select a component from history
  const selectComponent = (id: string) => {
    appStore.setCurrentComponent(id);
  };
</script>

<div class="component-history">
  <div class="history-header">
    <h2>Component History</h2>
  </div>
  
  {#if $components.length === 0}
    <div class="empty-history">
      <p>No components generated yet.</p>
      <p class="hint">Enter a prompt to generate your first component.</p>
    </div>
  {:else}
    <div class="history-list">
      {#each $components as component, index}
        <div 
          class="history-item" 
          class:active={component.id === $currentComponentId}
          on:click={() => selectComponent(component.id)}
        >
          <div class="item-header">
            <span class="item-number">#{$components.length - index}</span>
            <span class="item-timestamp">{formatTimestamp(component.timestamp)}</span>
          </div>
          <div class="item-prompt">
            {truncatePrompt(component.prompt)}
          </div>
          {#if component.id === $currentComponentId && index > 0}
            <div class="undo-hint">
              <button 
                class="undo-button"
                on:click|stopPropagation={() => selectComponent($components[index - 1].id)}
              >
                Undo to Previous Version
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .component-history {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .history-header {
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  .history-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
  
  .empty-history {
    padding: 2rem 1rem;
    text-align: center;
    color: #666;
  }
  
  .hint {
    font-style: italic;
    font-size: 0.9rem;
    color: #888;
  }
  
  .history-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .history-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .history-item:last-child {
    border-bottom: none;
  }
  
  .history-item:hover {
    background-color: #f9f9f9;
  }
  
  .history-item.active {
    background-color: #f0f7ff;
    border-left: 3px solid #0066cc;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    font-size: 0.8rem;
  }
  
  .item-number {
    font-weight: bold;
    color: #333;
  }
  
  .item-timestamp {
    color: #888;
  }
  
  .item-prompt {
    font-size: 0.9rem;
    color: #555;
  }
  
  .undo-hint {
    margin-top: 0.5rem;
    text-align: right;
  }
  
  .undo-button {
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .undo-button:hover {
    background-color: #0055aa;
  }
</style>