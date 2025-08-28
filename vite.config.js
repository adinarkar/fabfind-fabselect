// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fabfind-fabselect',
  plugins: [react()],
  build: { sourcemap: false, outDir: 'dist', assetsDir: 'assets' }
})
