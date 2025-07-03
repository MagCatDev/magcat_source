import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {ignores: ["dist"]},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {},
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "arrow-parens": ["error", "always"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "prefer-const": [
                2,
                {
                    ignoreReadBeforeAssign: false,
                },
            ],
            "object-curly-spacing": ["error", "always"],
            "no-undef": "off",
            "no-prototype-builtins": "off",
        },
    },
);
