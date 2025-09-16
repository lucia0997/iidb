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
        helpers: true,
        useESmodules: false,
      },
    ],
  ],
  ignore: ["**/*.types.ts"],
};
