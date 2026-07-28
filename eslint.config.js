import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * ESLint flat config.
 *
 * Deliberately not type-aware (no `projectService`): type-aware linting is much
 * slower and duplicates most of what `npm run lint:types` already catches.
 * This config targets the things tsc does not — hook rules, unused code, and
 * accidental `any`.
 */
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      // Wrangler's generated dev bundles — not our source.
      '.wrangler/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Underscore prefix is the escape hatch for intentionally unused values.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Warn rather than error: this is an existing codebase, and a failing
      // lint run that nobody can get to zero just gets ignored.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Node-side files: build config, scripts, and the Worker backend.
  {
    files: [
      '*.config.{js,cjs,mjs,ts}',
      'scripts/**/*.{js,cjs,mjs}',
      'backend/**/*.ts',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // CommonJS config files legitimately use require()/module.exports.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
