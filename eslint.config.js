import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
    {
        ignores: ["**/node_modules", "**/dist", "cypress", "src/**/*.test.ts", "src/**/*.test.tsx", "src/stories"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2020,
            },
            parserOptions: {
                project: ["./tsconfig.json"],
                warnOnUnsupportedTypeScriptVersion: true,
            },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "none",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/dot-notation": [
                "error",
                {
                    allowIndexSignaturePropertyAccess: true,
                },
            ],
            "@typescript-eslint/no-use-before-define": "off",
        },
    },
    {
        files: ["src/**/*.tsx"],
        rules: {
            "@typescript-eslint/no-use-before-define": "off",
        },
    },
    prettier
)
