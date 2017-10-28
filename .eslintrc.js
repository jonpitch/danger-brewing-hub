module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  env: {
    browser: false,
    node: true
  },
  rules: {
    'no-console': 0
  },
  globals: {
    QUnit: true
  }
};
