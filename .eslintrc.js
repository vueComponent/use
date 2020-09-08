module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
  },
  env: {
    browser: true,
    node: true,
  },
};
