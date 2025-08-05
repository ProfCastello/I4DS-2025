module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          env: {
            development: {
              moduleName: "@env",
              path: ".env.development",
            },
            production: {
              moduleName: "@env",
              path: ".env.production",
            },
          },
        },
      ],
    ],
  };
};
