module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks', '@typescript-eslint'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'max-lines-per-function': ['error', { max: 40 }],
    'no-magic-numbers': ['error', { ignore: [-1, 0, 1, 100] }],
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
