module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: true,
    },
    env: {
        node: true,
        browser: true,
        jest: true,
        es2020: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: ['@typescript-eslint', 'react-hooks', 'jest'],
    extends: ['prettier/prettier', 'plugin:react-hooks/recommended'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/dot-notation': [
            'error',
            {
                allowIndexSignaturePropertyAccess: true,
            },
        ],
    },
    overrides: [
        {
            files: ['**/*.spec.ts', '**/*.spec.tsx'],
            env: { 'jest/globals': true },
            plugins: ['jest'],
            extends: ['plugin:jest/all'],
            rules: {
                'jest/max-expects': [
                    'error',
                    {
                        max: 10,
                    },
                ],
                'jest/prefer-expect-assertions': ['error', { onlyFunctionsWithAsyncKeyword: true }],
                'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
                '@typescript-eslint/no-non-null-assertion': 'off',
            },
        },
        {
            files: ['src/**/*.tsx'],
            rules: {
                '@typescript-eslint/no-use-before-define': 'off',
            },
        },
        {
            files: ['src/**/*.ts*'],
            rules: {
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        args: 'none',
                        ignoreRestSiblings: true,
                    },
                ],
            },
        },
    ],
};
