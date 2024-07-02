import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.amd,
        ...globals.browser
      }
    },
    rules: {
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none']
        }
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  },
  {
    ignores: ['node_modules', 'dist', 'index.d.ts']
  },
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json'
      }
    }
  }
);
