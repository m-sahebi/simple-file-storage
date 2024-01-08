const { resolve } = require("path");

const project = resolve(__dirname, "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
  ],
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    eqeqeq: ["error", "always", { null: "ignore" }],
  },
};
