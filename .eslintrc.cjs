module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  rules: {
    'react/jsx-sort-props': [
      1,
      {
        callbacksLast: true,
        shorthandLast: true,
        reservedFirst: true,
      },
    ],
    'react/no-unknown-property': 0,
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
  },
};
