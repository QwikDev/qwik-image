import { fileURLToPath } from 'node:url';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikNxVite } from 'qwik-nx/plugins';

export default defineConfig({
  plugins: [
    qwikNxVite(),
    qwikCity(),
    qwikVite({
      client: {
        outDir: '../../dist/packages/qwik-demo-app/client',
      },
      ssr: {
        outDir: '../../dist/packages/qwik-demo-app/server',
      },
    }),
    tsconfigPaths({ root: '../../' }),
  ],
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['../../'],
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      // qwikVite serves the client variant of this virtual module during
      // vitest runs, which crashes in the node environment; the dist module
      // detects browser vs server at runtime instead
      '@builder.io/qwik/build': fileURLToPath(
        new URL(
          '../../node_modules/@builder.io/qwik/dist/build/index.mjs',
          import.meta.url
        )
      ),
    },
  },
});
