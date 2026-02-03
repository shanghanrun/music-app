// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'; // 변경
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// 빌드 결과물이 나올 폴더명을 지정합니다.
            pages: 'build',
            assets: 'build',
            fallback: 'index.html', // SPA 방식인 경우 필수
            precompress: false,
            strict: true
		})
	}
};

export default config;
