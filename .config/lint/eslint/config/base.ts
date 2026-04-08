/**
 * ESLint 基础规则配置
 *
 * @module eslint/config/base
 */

import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'

import { FILES_TS } from '../constants/files'
import {
    NAMING_CONVENTION_FUNCTION_RULES,
    NAMING_CONVENTION_OBJECT_RULES,
    NAMING_CONVENTION_TYPE_RULES,
    NAMING_CONVENTION_VARIABLE_RULES,
    NAMING_CONVENTION_CLASS_RULES,
} from '../constants/naming'

import type { Linter } from 'eslint'

export const bestPracticesConfig: Linter.Config = {
    name: 'app/best-practices',
    files: FILES_TS,
    rules: {
        eqeqeq: ['error', 'always'],
        'no-extra-boolean-cast': 'error',
        'no-cond-assign': 'error',
        'no-constant-condition': 'error',
        'no-negated-condition': 'warn',
        'no-nested-ternary': 'warn',
        'no-else-return': ['warn', { allowElseIf: false }],
        'no-param-reassign': ['error', { props: false }],
        'no-return-await': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'one-var': ['error', 'never'],
        'no-unused-expressions': 'error',
        'object-shorthand': ['error', 'always'],
        'prefer-destructuring': ['warn', { array: false, object: true }],
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'no-empty': ['error', { allowEmptyCatch: false }],
        'no-throw-literal': 'error',
        'no-unassigned-vars': 'error',
        'no-useless-assignment': 'error',
        'preserve-caught-error': 'error',
        'no-multi-assign': 'error',
    },
}

export const importRulesConfig: Linter.Config = {
    name: 'app/import-rules',
    files: FILES_TS,
    plugins: { import: importPlugin },
    rules: {
        // Disabled: eslint-plugin-import v2.x resolver doesn't work correctly
        // with @typescript-eslint/parser v8 in ESLint 9 flat config monorepo.
        // TypeScript compiler (--noEmit) already validates all import paths.
        'import/order': 'off',
        'import/no-duplicates': 'off',
        'import/first': 'off',
        'import/newline-after-import': 'off',
        'import/no-self-import': 'off',
        'import/no-useless-path-segments': 'off',
        'import/no-absolute-path': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-unresolved': 'off',
    },
}

export const promiseAsyncConfig: Linter.Config = {
    name: 'app/promise-async',
    files: FILES_TS,
    plugins: { promise },
    rules: {
        'promise/catch-or-return': ['error', { allowFinally: true }],
        'promise/no-return-wrap': 'error',
        'promise/always-return': 'error',
        'promise/no-nesting': 'warn',
        'promise/valid-params': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/promise-function-async': 'off',
        '@typescript-eslint/no-floating-promises': [
            'error',
            { ignoreVoid: true, ignoreIIFE: false },
        ],
        '@typescript-eslint/no-misused-promises': [
            'error',
            { checksConditionals: true, checksVoidReturn: true },
        ],
        'promise/prefer-await-to-then': 'warn',
    },
}

export const namingConventionTsConfig: Linter.Config = {
    name: 'app/naming-convention-ts',
    files: FILES_TS,
    rules: {
        '@typescript-eslint/naming-convention': [
            'error',
            ...NAMING_CONVENTION_VARIABLE_RULES,
            { selector: 'variable', modifiers: ['destructured'], format: null },
            ...NAMING_CONVENTION_FUNCTION_RULES,
            ...NAMING_CONVENTION_OBJECT_RULES,
            ...NAMING_CONVENTION_TYPE_RULES,
            ...NAMING_CONVENTION_CLASS_RULES,
        ],
    },
}

export const consoleDebuggerConfig: Linter.Config = {
    name: 'app/console-debugger',
    files: FILES_TS,
    rules: {
        'no-console': 'off',
        'no-debugger': 'error',
        'no-alert': 'error',
    },
}

export const commentsConfig: Linter.Config = {
    name: 'app/comments',
    files: FILES_TS,
    rules: {
        'multiline-comment-style': 'off',
        'capitalized-comments': 'off',
        'no-inline-comments': 'off',
        'no-warning-comments': [
            'warn',
            { terms: ['TODO', 'FIXME', 'XXX', 'HACK'], location: 'start' },
        ],
    },
}
