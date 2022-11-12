/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:mocha/recommended'
  ],
  plugins: ['@typescript-eslint', 'jsdoc', 'markdown', 'mocha'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    'no-extend-native': 0
  },
  ignorePatterns: ['*.json'],
  overrides: [
    {
      files: ['*.js', '*.test.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0
      }
    }
  ]
}
