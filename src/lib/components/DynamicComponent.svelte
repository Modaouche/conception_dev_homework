<script lang="ts">
  /**
   * DynamicComponent.svelte
   *
   * This component dynamically renders Svelte code as a component.
   * It uses the svelte:component element to render a component created at runtime.
   */

  import { onDestroy } from 'svelte';
  import { compile } from 'svelte/compiler';

  // The Svelte code to render as a string
  let { code = '' } = $props();

  // The compiled component
  let component: any = null;

  // Error state
  let error: string | null = null;

  // Function to compile the Svelte code into a component
  const compileCode = async (svelteCode: string) => {
    try {
      // Reset error state
      error = null;

      if (!svelteCode.trim()) {
        component = null;
        return;
      }

      // Compile the Svelte code
      const result = compile(svelteCode, {
        filename: 'DynamicComponent.svelte',
        dev: true,
        generate: 'dom',       // compile to browser DOM
        css: 'injected'         // automatically inject CSS into <head>
        // remove format completely
      });


      // Modify the compiled code to handle internal Svelte imports
      let jsCode = result.js.code;

      try {
        console.log('Original compiled code size:', jsCode.length);

        // Replace imports of internal Svelte modules with mock implementations
        // This fixes the "Failed to resolve module specifier 'svelte/internal/disclose-version'" error
        // jsCode = jsCode.replace(
        //   /import\s+.*\s+from\s+['"]svelte\/internal\/disclose-version['"];?/g,
        //   '/* Mock for svelte/internal/disclose-version */ const VERSION = "5.0.0";'
        // );

        // Handle other potential internal Svelte imports with named exports
        jsCode = jsCode.replace(
          /import\s+\{([^}]+)\}\s+from\s+['"]svelte\/internal[^'"]*['"];?/g,
          (match, imports) => {
            // Create mock implementations for each imported item
            const mockImports = imports.split(',')
              .map(item => {
                const trimmed = item.trim();
                const name = trimmed.split(' as ').pop().trim();
                return `const ${name} = () => {}; /* Mock for svelte/internal */`;
              })
              .join('\n');
            return mockImports;
          }
        );

        // Handle direct imports from svelte/internal (default exports)
        jsCode = jsCode.replace(
          /import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]svelte\/internal[^'"]*['"];?/g,
          (match, name) => {
            return `const ${name} = () => {}; /* Mock for svelte/internal default export */`;
          }
        );

        console.log('Modified compiled code size and content:', jsCode.length, jsCode);
      } catch (err) {
        console.error('Error modifying compiled code:', err);
        // Continue with the original code if modification fails
      }
      console.log("Create a JavaScript module from the modified compiled code:");

      // Create a JavaScript module from the modified compiled code
      const moduleUrl = URL.createObjectURL(
        new Blob([jsCode], { type: 'application/javascript' })
      );
      console.log(" module from the modified compiled code created: ", moduleUrl);

      // Import the module
      const module = await import(/* @vite-ignore */ moduleUrl);

      console.log(" module imported: ", module);

      // Set the component
      component = module.default;

      console.log("component, final result:", component);

      // Clean up the URL object
      URL.revokeObjectURL(moduleUrl);
    } catch (e) {
      console.error('Error compiling Svelte code:', e);
      error = e instanceof Error ? e.message : String(e);
      component = null;
    }
  };

  // Watch for changes to the code prop
  $effect(() => {
    if (code) {
      compileCode(code);
    } else {
      component = null;
    }
  });

  // Clean up on component destruction
  onDestroy(() => {
    component = null;
  });
</script>

{#if error}
  <div class="error">
    <h3>Error rendering component:</h3>
    <pre>{error}</pre>
  </div>
{:else if component}
  <div class="component-container">
    <svelte:component this={component} />
  </div>
{:else}
  <div class="placeholder">
    <p>No component to display. Enter a prompt to generate a component.</p>
  </div>
{/if}

<style>
  .error {
    padding: 1rem;
    border: 1px solid #ff3e00;
    border-radius: 4px;
    background-color: #fff5f5;
    color: #ff3e00;
    margin-bottom: 1rem;
  }

  .error pre {
    white-space: pre-wrap;
    overflow-x: auto;
    max-height: 300px;
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .component-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    background-color: #fff;
  }

  .placeholder {
    padding: 2rem;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px dashed #ddd;
    border-radius: 4px;
    color: #666;
  }
</style>
