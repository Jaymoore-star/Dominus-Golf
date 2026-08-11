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

  /**
   * react-refresh/only-export-components, switched off for two deliberate
   * patterns. The rule is a hot-reload hint, not a correctness check: a file
   * exporting both a component and something else still builds and still runs,
   * it just costs a full page reload instead of a component swap when edited.
   *
   * `components/ui/**` is vendored shadcn/ui. Every one of these files exports
   * its `cva` variants alongside the component, because that is how the
   * generator emits them. Splitting them would have to be redone by hand every
   * time a component is re-added or updated from upstream, in exchange for
   * faster refresh in files nobody edits.
   *
   * `store/*.tsx` are React contexts, where a Provider component and its
   * `useCart` / `useWishlist` hook live in one file. That is the idiomatic
   * shape — the hook exists to read the context the Provider supplies, and
   * separating them means every consumer imports from two modules to use one
   * feature. Around twenty call sites would change to silence a DX warning.
   *
   * Anywhere else the rule stays on, and the fix is to move the non-component
   * export out — as `fieldClass` was moved out of `components/auth/FieldError`.
   */
  {
    files: ['src/components/ui/**/*.{ts,tsx}', 'src/store/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
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
