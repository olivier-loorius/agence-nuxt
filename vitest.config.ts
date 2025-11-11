import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*.vue', 'composables/**/*.ts'],
      exclude: ['node_modules/', 'tests/'],
    },
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
