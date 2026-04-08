/**
 * ESLint TypeScript 最严格配置
 *
 * @module eslint/config/typescript-strictest
 */

import { FILES_TS } from '../constants/files'

import type { Linter } from 'eslint'

export const typeScriptStrictestConfig: Linter.Config = {
    name: 'app/typescript-strictest',
    files: FILES_TS,
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: false,
            },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-expect-error': 'allow-with-description',
                'ts-ignore': true,
                'ts-nocheck': true,
                minimumDescriptionLength: 10,
            },
        ],
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
        ],

        // STRICT
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/no-empty-object-type': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/method-signature-style': ['error', 'method'],
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': [
            'error',
            {
                ignoreConditionalTests: false,
                ignoreMixedLogicalExpressions: false,
            },
        ],
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/strict-boolean-expressions': 'off',

        // TYPE-CHECKED
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-floating-promises': [
            'error',
            { ignoreVoid: true, ignoreIIFE: true },
        ],
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksConditionals: true,
                checksVoidReturn: true,
                checksSpreads: true,
            },
        ],
        '@typescript-eslint/promise-function-async': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unsafe-declaration-merging': 'error',

        // 额外严格规则
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-includes': 'warn',
        '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
        '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
        '@typescript-eslint/no-import-type-side-effects': 'error',
    },
}
