module.exports = {
  style: {
    sass: {
      loaderOptions: () => ({
        // Prefer `dart-sass`
        implementation: require("sass"),
      }),
    },
  },
  webpack: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
};
