import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' + single-file build => one self-contained index.html.
// Output goes to docs/ so GitHub Pages can serve it directly with
// "Deploy from a branch -> main -> /docs" (no build step / no Actions needed).
// `npm run dev` still works for development.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'docs', emptyOutDir: true },
  server: { port: 5173 },
})
