module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [ 'eslint:recommended', 'plugin:prettier/recommended' ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [ 'prettier' ],
  rules: {
    'no-console': 1,
    'prettier/prettier': 'error',
  },
};
