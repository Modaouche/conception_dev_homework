<script lang="ts">
	/**
	 * Main page component for the Lovable-style tool
	 *
	 * This is the main application page that integrates all the components and implements
	 * the functionality for transforming natural language prompts into Svelte pages.
	 */

	import { onMount } from 'svelte';
	import ApiKeyInput from '$lib/components/ApiKeyInput.svelte';
	import Conversation from '$lib/components/Conversation.svelte';
	import DynamicComponent from '$lib/components/DynamicComponent.svelte';
	import CodeViewer from '$lib/components/CodeViewer.svelte';
	import ComponentHistory from '$lib/components/ComponentHistory.svelte';
	import { generateSvelteCode } from '$lib/openai-service';
	import { apiKey, currentComponent, conversation, appStore, currentComponentId } from '$lib/store';

	// Whether the application is in a loading state
	let isLoading = false;

	// Whether there was an error generating code
	let error: string | null = null;

	// Handle prompt submission
	const handlePromptSubmit = async (prompt: string) => {
		try {
			// Reset error state
			error = null;

			// Set loading state
			isLoading = true;

			// Get conversation history for context
			const conversationHistory = $conversation.map(msg => ({
				role: msg.role,
				content: msg.content
			}));

			// Generate Svelte code from the prompt
			const generatedCode = await generateSvelteCode(prompt, conversationHistory);

			// Add the generated code to the store
			appStore.addComponent(generatedCode, prompt);

			// Add the assistant's response to the conversation
			appStore.addMessage('assistant', 'Component generated successfully! You can now see it rendered below.');

		} catch (e) {
			console.error('Error generating component:', e);
			error = e instanceof Error ? e.message : String(e);
		} finally {
			isLoading = false;
		}
	};
</script>

<main>
	<header>
		<h1>Lovable Svelte Generator</h1>
		<p class="description">
			Transform natural language prompts into functional Svelte components.
			Enter your prompt, refine through conversation, and see your ideas come to life!
		</p>
	</header>

	<!-- API Key Input -->
	<section class="section">
		<ApiKeyInput />
	</section>

	{#if $apiKey}
		<div class="app-container">
			<!-- Left Column: Conversation and History -->
			<div class="left-column">
				<!-- Component History -->
				<section class="section">
					<ComponentHistory />
				</section>

				<!-- Conversation Interface -->
				<section class="section conversation-section">
					<Conversation onSubmitPrompt={handlePromptSubmit} />
				</section>
			</div>

			<!-- Right Column: Generated Component and Code -->
			<div class="right-column">
				<!-- Generated Component Preview -->
				<section class="section">
					<div class="preview-header">
						<h2>Component Preview</h2>
					</div>

					{#if error}
						<div class="error-message">
							<h3>Error generating component:</h3>
							<p>{error}</p>
						</div>
					{:else if $currentComponent}
						<div>
							<DynamicComponent code={$currentComponent.code} />
							<CodeViewer code={$currentComponent.code} />
						</div>
					{:else}
						<div class="empty-preview">
							<p>No component generated yet. Enter a prompt to get started!</p>
						</div>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		max-width: 600px;
		margin: 0 auto;
	}

	.section {
		margin-bottom: 1.5rem;
	}

	.app-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.left-column, .right-column {
		display: flex;
		flex-direction: column;
	}

	.conversation-section {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.preview-header {
		padding: 0.5rem 1rem;
		background-color: #f5f5f5;
		border: 1px solid #ddd;
		border-bottom: none;
		border-radius: 4px 4px 0 0;
	}

	.preview-header h2 {
		margin: 0;
		font-size: 1.2rem;
		color: #333;
	}

	.error-message {
		padding: 1rem;
		border: 1px solid #ff3e00;
		border-radius: 0 0 4px 4px;
		background-color: #fff5f5;
		color: #ff3e00;
	}

	.empty-preview {
		padding: 3rem 1rem;
		text-align: center;
		background-color: #f9f9f9;
		border: 1px dashed #ddd;
		border-radius: 0 0 4px 4px;
		color: #666;
	}

	/* Responsive layout for smaller screens */
	@media (max-width: 768px) {
		.app-container {
			grid-template-columns: 1fr;
		}

		.right-column {
			order: -1;
		}
	}
</style>
