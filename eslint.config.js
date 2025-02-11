import js from "@eslint/js";
import globals from "globals";
import node from "eslint-plugin-node";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/** @type {import('eslint').Linter.Config} */
export default [
  // Node.js & Backend
  {
    files: ["backend/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Frontend
  {
    files: ["frontend/**/*.{js,jsx}"],
    ignores: ["frontend/dist"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "18.3",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Vite config
  {
    files: ["frontend/vite.config.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly",
      },
      sourceType: "module",
    },
    plugins: {
      node,
    },
    extends: ["plugin:node/recommended"],
    rules: {
      ...js.configs.recommended.rules,
      "node/no-process-env": "off",
    },
  },
];
