import { FlatCompact } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import noMergeConflicts from 'eslint-plugin-no-merge-conflicts';


const compat = new FlatCompact({ baseDirectory: __dirname });

export default [
  // Extend the recommended configurations
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ),

  // Ignore build and dependencies
  { ignores: ['dist/**', 'node_modules/**'] },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: __dirname
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        React: 'readonly',
        JSX: 'readonly'
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: {} }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'no-merge-conflicts': noMergeConflicts
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',

      // React hooks
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Import plugin rules
      'import/order': [
        'warn', {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ],
      'import/no-unresolved': 'error',

      // Enforce no traililng spaces and newline
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
    }
  }
];
