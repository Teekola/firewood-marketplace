import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all,
});

const eslintConfig = [
   ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
   {
      rules: {
         "react/jsx-no-literals": "error",

         "no-restricted-imports": [
            "error",
            {
               name: "next/link",
               message: "Please import from `@/i18n/routing` instead.",
            },
            {
               name: "next/navigation",
               importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
               message: "Please import from `@/i18n/routing` instead.",
            },
         ],
      },
   },
];

export default eslintConfig;
