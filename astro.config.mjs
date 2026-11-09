// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Detecta se o build está rodando no GitHub Actions para GitHub Pages
// @ts-ignore
const isGitHubPages = globalThis.process?.env?.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages
    ? 'https://guilhermegomeslima.github.io'
    : 'https://guilhermegomesdev-blog.vercel.app',
  base: isGitHubPages ? '/guilherme.dev-blog/' : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
