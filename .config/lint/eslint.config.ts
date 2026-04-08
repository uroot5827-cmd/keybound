/**
 * ESLint Flat Config - keybound 库配置
 *
 * 精简自 TaskFlow，针对 TypeScript 库优化。
 * 移除了所有 Vue 相关、App 层相关的配置。
 *
 * @module lint/eslint.config
 */

import { fileURLToPath } from 'node:url'

import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import { globalIgnores } from 'eslint/config'

import {
    bestPracticesConfig,
    commentsConfig,
    consoleDebuggerConfig,
    importRulesConfig,
    namingConventionTsConfig,
    promiseAsyncConfig,
} from './eslint/config/base'
import { typeScriptStrictestConfig } from './eslint/config/typescript-strictest'
import { codeQualityConfig, unicornConfig } from './eslint/config/quality'
import { FILES_TS, GLOBAL_IGNORES } from './eslint/constants/files'
import { preferNativeMethods } from './eslint/rules'

export default [
    // 全局忽略
    globalIgnores(GLOBAL_IGNORES),

    // 文件范围
    {
        name: 'app/files',
        files: FILES_TS,
    },

    // Linter 选项
    {
        name: 'app/linter-options',
        linterOptions: { reportUnusedDisableDirectives: true },
    },

    // TypeScript 解析器
    {
        name: 'app/parser',
        files: FILES_TS,
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: true,
            },
        },
    },

    // 全局插件设置
    {
        name: 'app/settings',
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
    },

    // TypeScript 插件（禁用 parser 本身，保留规则）
    {
        name: 'app/typescript-rules',
        files: FILES_TS,
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...typeScriptStrictestConfig.rules,
        },
    },

    // 自定义规则
    {
        name: 'app/custom-rules',
        files: FILES_TS,
        plugins: {
            'custom-rules': {
                rules: {
                    'prefer-native-methods': preferNativeMethods,
                },
            },
        },
    },

    // 基础规则
    bestPracticesConfig,
    importRulesConfig,
    promiseAsyncConfig,
    namingConventionTsConfig,
    consoleDebuggerConfig,
    commentsConfig,

    // 代码质量
    codeQualityConfig,
    unicornConfig,

    // 配置文件豁免
    {
        name: 'app/config-file-exemption',
        files: ['*.config.ts', '*.config.js', '.config/**/*.ts'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
        },
    },

    // 测试文件豁免
    {
        name: 'app/test-file-exemption',
        files: ['**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'no-magic-numbers': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-require-await': 'off',
        },
    },
]
