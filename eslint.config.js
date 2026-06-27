import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig(
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**"],
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
  },
);
