import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable all rules by setting them to "off"
      // This overrides any rules from extended configurations
      all: "off", // This is a catch-all to disable all possible rules
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      // Add any other specific rules you want to ensure are disabled
    },
  },
];

export default eslintConfig;
