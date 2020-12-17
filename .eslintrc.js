module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ['standard', 'eslint:recommended', 'plugin:mocha/recommended'],
  plugins: ['jsdoc', 'markdown', 'mocha'],
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
