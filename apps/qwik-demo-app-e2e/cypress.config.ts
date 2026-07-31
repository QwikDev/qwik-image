import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  e2e: nxE2EPreset(projectDir, {
    bundler: 'vite',
  }),
});
