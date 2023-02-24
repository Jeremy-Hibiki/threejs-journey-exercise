module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/stylelint'), 'stylelint-config-recess-order'],
  rules: {
    'selector-class-pattern': null,
  },
};
