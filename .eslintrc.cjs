module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    jest: true,
    // node: true,  // If you don't want to add `node: true` globally...
  },
  overrides: [
    {
      files: ["**/*.cjs"],
      env: {
        es2023: true,
        node: true,
      },
    },
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react",
    "@typescript-eslint",
    "react-hooks",
    "jsx-a11y",
    "react-refresh",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prettier/prettier": "error",
    "no-console": "error",
    "no-unused-vars": "error",
    "react/display-name": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-key": "error",
    "react/jsx-props-no-spreading": "error",
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
