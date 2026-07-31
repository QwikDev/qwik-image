/// <reference types="vitest" />

import { qwikVite } from '@qwik.dev/core/optimizer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json';

const { dependencies = {}, peerDependencies = {} } = pkg as any;
const makeRegex = (dep: string) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj: string) => Object.keys(obj).map(makeRegex);
const projectRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(projectRoot, '../..');

export default defineConfig({
  root: projectRoot,
  cacheDir: join(workspaceRoot, 'node_modules/.vitest'),
  plugins: [
    qwikVite(),
    tsconfigPaths({ root: workspaceRoot }),
    dts({
      tsConfigFilePath: join(
        dirname(fileURLToPath(import.meta.url)),
        'tsconfig.lib.json'
      ),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),
    viteStaticCopy({
      targets: [{ src: '../../README.md', dest: './' }],
    }),
  ],
  server: {
    fs: {
      // Allow serving files from the project root
      allow: [workspaceRoot],
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
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@qwik.dev/core/build': fileURLToPath(
        new URL(
          '../../node_modules/@qwik.dev/core/dist/build/index.mjs',
          import.meta.url
        )
      ),
    },
    coverage: {
      reportsDirectory: '../../coverage/packages/qwik-image',
    },
  },
});
