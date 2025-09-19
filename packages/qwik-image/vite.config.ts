/// <reference types="vitest" />

import { qwikVite } from '@qwik.dev/core/optimizer';
import { dirname, join } from 'path';
import { qwikNxVite } from 'qwik-nx/plugins';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    qwikNxVite(),
    qwikVite(),
    tsconfigPaths({ root: '../../' }),
    dts({
      tsConfigFilePath: join(
        dirname(fileURLToPath(import.meta.url)),
        'tsconfig.lib.json'
      ),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),
    viteStaticCopy({
      targets: [
        { src: '../../README.md', dest: './' },
      ],
    }),
  ],
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['../../'],
    },
  },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    target: 'es2020',
    lib: {
      entry: './src/index.ts',
      // Could also be a dictionary or array of multiple entry points.
      name: 'qwik-image',
      fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      // fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: '../../coverage/packages/qwik-image',
    },
  },
});
