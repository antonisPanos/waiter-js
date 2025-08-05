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
    ignores: ['node_modules', 'dist', 'index.d.ts', 'coverage']
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
  },
  {
    files: ['tests/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest
      },
      parserOptions: {
        project: 'tsconfig.test.json'
      }
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);
