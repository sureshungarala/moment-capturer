module.exports = {
  style: {
    css: {
      loaderOptions: () => {
        return { url: false }; // resolve relative /public folder and not from defined file [https://github.com/facebook/create-react-app/issues/10022]
      },
    },
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
