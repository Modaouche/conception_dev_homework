import { compile } from 'svelte/compiler';
import type { RequestHandler } from './$types';
import esbuild from 'esbuild';

export const POST: RequestHandler = async ({ request }) => {
    const { code } = await request.json();

    try {
        // 1. Compile Svelte code to JS
        const { js } = compile(code, {
            filename: 'GeneratedComponent.svelte',
            generate: 'client',
            dev: true,
            css: 'injected'
        });

        // 2. Bundle the compiled JS with esbuild to inline svelte/internal imports
        const bundle = await esbuild.build({
            stdin: {
                contents: js.code,
                resolveDir: process.cwd(),
                sourcefile: 'GeneratedComponent.js',
                loader: 'js',
            },
            bundle: true,
            format: 'esm',
            write: false, // don’t write to disk
            platform: 'browser',
        });

        return new Response(JSON.stringify({ js: bundle.outputFiles[0].text }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({
            error: e instanceof Error ? e.message : String(e)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
