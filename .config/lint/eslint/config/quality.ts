/**
 * ESLint 代码质量规则配置
 *
 * @module eslint/config/quality
 */

import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'

import { FILES_TS } from '../constants/files'

import type { Linter } from 'eslint'

export const codeQualityConfig: Linter.Config = {
    name: 'app/code-quality',
    files: FILES_TS,
    plugins: { sonarjs },
    rules: {
        'sonarjs/cognitive-complexity': ['error', 15],
        complexity: ['error', 10],
        'max-depth': ['error', 4],
        'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
        'sonarjs/no-identical-functions': 'error',
        'sonarjs/no-all-duplicated-branches': 'error',
        'sonarjs/no-identical-conditions': 'error',
        'sonarjs/no-inverted-boolean-check': 'error',
        'sonarjs/no-redundant-boolean': 'error',
        'sonarjs/no-useless-catch': 'error',
        'sonarjs/no-small-switch': 'error',
        'sonarjs/no-nested-template-literals': 'warn',
        'sonarjs/max-switch-cases': ['error', 10],
    },
}

export const unicornConfig: Linter.Config = {
    name: 'app/unicorn',
    files: FILES_TS,
    plugins: { unicorn },
    rules: {
        'unicorn/error-message': 'error',
        'unicorn/catch-error-name': ['error', { name: 'error' }],
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/consistent-function-scoping': 'warn',
        'unicorn/no-useless-undefined': 'error',
        'unicorn/no-useless-spread': 'error',
        'unicorn/explicit-length-check': 'error',
        'unicorn/no-for-loop': 'warn',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/prefer-spread': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-array-flat': 'error',
        'unicorn/prefer-array-flat-map': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-string-trim-start-end': 'error',
        'unicorn/prefer-string-replace-all': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/numeric-separators-style': [
            'warn',
            { onlyIfContainsSeparator: false },
        ],
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-object-from-entries': 'warn',
        'unicorn/prefer-set-has': 'warn',
        'unicorn/prefer-switch': 'off',
        'unicorn/prefer-ternary': 'warn',
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-top-level-await': 'warn',
        'unicorn/better-regex': 'warn',
        'unicorn/escape-case': 'error',
        'unicorn/text-encoding-identifier-case': 'error',
    },
}
