import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project site → served at /Portfolio-NZ/
export default defineConfig({
  site: 'https://dgonzalez211.github.io',
  base: '/Portfolio-NZ',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
