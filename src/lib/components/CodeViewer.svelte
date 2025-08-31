<script lang="ts">
  /**
   * CodeViewer.svelte
   * 
   * This component displays Svelte code with syntax highlighting.
   * It provides a simple code viewer for the generated Svelte components.
   */
  
  // The code to display
  let { code = '' } = $props();
  
  // Whether the code viewer is expanded
  let expanded = false;
  
  // Toggle the expanded state
  const toggleExpanded = () => {
    expanded = !expanded;
  };
</script>

<div class="code-viewer">
  <div class="header">
    <h3>Generated Svelte Code</h3>
    <button class="toggle-button" on:click={toggleExpanded}>
      {expanded ? 'Collapse' : 'Expand'}
    </button>
  </div>
  
  {#if expanded || !expanded}
    <pre class="code-block" class:expanded><code>{code}</code></pre>
  {/if}
</div>

<style>
  .code-viewer {
    margin-top: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  .header h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
  
  .toggle-button {
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .toggle-button:hover {
    background-color: #333;
  }
  
  .code-block {
    margin: 0;
    padding: 1rem;
    background-color: #f9f9f9;
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
  }
  
  .code-block.expanded {
    max-height: none;
  }
  
  /* Style for the code */
  code {
    color: #333;
  }
</style>