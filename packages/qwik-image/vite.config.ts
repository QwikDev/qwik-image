/// <reference types="vitest" />

import { qwikVite } from '@qwik.dev/core/optimizer';
import { dirname, join } from 'path';
import { qwikNxVite } from 'qwik-nx/plugins';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json';

const { dependencies = {}, peerDependencies = {} } = pkg as any;
const makeRegex = (dep: string) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj: string) => Object.keys(obj).map(makeRegex);

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
      entry: './src/index',
      formats: ['es', 'cjs'] as const,
      // This adds .qwik so all files are processed by the optimizer
      fileName: (format, entryName) =>
        `${entryName}.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      // externalize deps that shouldn't be bundled into the library
      external: [
        /^node:.*/,
        ...excludeAll(dependencies),
        ...excludeAll(peerDependencies),
      ],
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
