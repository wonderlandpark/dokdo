import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  external: [],
  noExternal: [],
  platform: 'node',
  format: ['esm', 'cjs'],
  target: 'es2022',
  skipNodeModulesBundle: true,
  clean: true,
  shims: true,
  minify: false,
  splitting: false,
  keepNames: true,
  dts: true,
  sourcemap: true,
  legacyOutput: true,
})
