const config = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
  ],
};
module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining','@babel/plugin-proposal-nullish-coalescing-operator'],
  env: {
    dev: config,
    test: config,
  },
};
