module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-refresh',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off', // React 17+ no longer requires importing React to use JSX
    'react/prop-types': 'off', // TypeScript handles type-checking for props
    '@typescript-eslint/no-explicit-any': 'warn', // Warns against using 'any' type
    'no-console': '["error", { allow: ["warn", "error"] }]',
    'no-debugger': 'warn',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'eqeqeq': ['error', 'always'], // Enforces the use of === and !== instead of == and !=
    'quotes': ['error', 'single'], // Enforces the use of single quotes
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // disables cross-feature imports:
          // eg. src/features/discussions should not import from src/features/comments, etc.
          // {
          //   target: './src/features/auth',
          //   from: './src/features',
          //   except: ['./auth'],
          // },

          // enforce unidirectional codebase:
          // e.g. src/app can import from src/features but not the other way around
          {
            target: './src/features',
            from: './src/app',
          },

          // e.g src/features and src/app can import from these shared modules but not the other way around
          {
            target: [
              './src/components',
              './src/hooks',
              './src/lib',
              './src/types',
              './src/utils',
            ],
            from: ['./src/features', './src/app'],
          },
        ],
      },
    ],
  },
};
