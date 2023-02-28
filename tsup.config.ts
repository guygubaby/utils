import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts', './src/dom/index.ts'],
  splitting: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
})
