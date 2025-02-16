module.exports = {
  extends: [
    'eslint:recommended',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    'linebreak-style': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used', ignoreRestSiblings: true }]
  }
}
