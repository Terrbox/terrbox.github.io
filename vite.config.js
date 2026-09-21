import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' + single-file build => one self-contained dist/index.html that runs
// from file:// (double-click) with no server. `npm run dev` is only for dev.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  server: { port: 5173 },
})
