module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    [
      "@babel/preset-typescript",
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
  ],
  sourceType: "unambiguous",
  sourceMaps: "inline",
  plugins: [
    "@vue/babel-plugin-jsx",
    ["@babel/plugin-transform-typescript", { allowNamespaces: true }],
  ],
};
