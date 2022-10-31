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
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'no-extend-native': 0,
    'no-eval': 0,
    'no-use-before-define': 0,
    quotes: 1,
    semi: 1
  },
  ignorePatterns: ['dist/*', 'node_modules/*', 'examples', 'test']
}
