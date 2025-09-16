module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false }],
    ["@babel/preset-react", { runtime: "automatic" }],
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
        corejs: false,
        helpers: true,
        useESmodules: true,
      },
    ],
  ],
  ignore: ["**/*.types.ts"],
};
