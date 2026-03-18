import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Targeted ignores for unused/broken components and files
    "components/dashboard/**",
    "components/data-table1.tsx",
    "components/form-layout-01.tsx",
    "components/header.tsx",
    "_broken_routes/**",
    "lib/actions.ts",
    "app/(marketing)/learn_more/page.tsx",
    "app/globals.css",
  ]),
]);

export default eslintConfig;
