import cypress from 'eslint-plugin-cypress';
import baseConfig from '../../eslint.config.js';

export default [cypress.configs.recommended, ...baseConfig];
