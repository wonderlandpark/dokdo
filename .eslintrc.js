module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'eslint:recommended'],
  plugins: ['jsdoc', 'markdown'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'no-extend-native': 0
  },
  ignorePatterns: ['yarn.lock', '*.json']
}
