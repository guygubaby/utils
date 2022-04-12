import type { Options } from 'tsup'

export const tsup: Options = {
  entry: [
    './src/index.ts',
    './src/dom/index.ts',
  ],
  splitting: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
}
