module.exports = {
  root: true,
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'error',
  },
  overrides: [
    {
      files: ['apps/client/**/*', 'apps/admin/**/*'],
      extends: ['next/core-web-vitals'],
      env: {
        browser: true,
      },
    },
    {
      files: ['backend/**/*'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended'
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
      env: {
        node: true,
      },
    },
  ],
}