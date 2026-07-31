import { fileURLToPath } from 'node:url';
import { qwikVite } from '@qwik.dev/core/optimizer';
import { qwikCity } from '@qwik.dev/router/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root: projectRoot,
  cacheDir: `${workspaceRoot}/node_modules/.vitest`,
  plugins: [
    qwikCity(),
    qwikVite({
      client: {
        outDir: '../../dist/packages/qwik-demo-app/client',
      },
      ssr: {
        outDir: '../../dist/packages/qwik-demo-app/server',
      },
    }),
    tsconfigPaths({ root: workspaceRoot }),
  ],
  server: {
    fs: {
      // Allow serving files from the project root
      allow: [workspaceRoot],
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
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
  },
});
