module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
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
  },
};
