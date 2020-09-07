module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-types": ["error", { type: { object: false } }],
  },
  env: {
    browser: true,
    node: true,
  },
};
