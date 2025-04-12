
const { defineConfig } = require('eslint/config')

const typescriptParser = require('@typescript-eslint/parser')
const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const jsdocPlugin = require('eslint-plugin-jsdoc')
const markdownPlugin = require('eslint-plugin-markdown')
const mochaPlugin = require('eslint-plugin-mocha')

module.exports = defineConfig([
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      jsdoc: jsdocPlugin,
      markdown: markdownPlugin,
      mocha: mochaPlugin,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-extend-native': 'off',
    },
    ignores: ['*.json'],
  },
  {
    files: ['*.js', '*.test.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
])
