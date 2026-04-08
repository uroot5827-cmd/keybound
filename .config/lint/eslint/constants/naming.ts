/**
 * ESLint 命名规范规则表
 *
 * @module eslint/constants/naming
 */

export const NAMING_CONVENTION_VARIABLE_RULES = [
    { selector: 'variable', format: ['camelCase'], leadingUnderscore: 'allow' },
    {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
    },
]

export const NAMING_CONVENTION_TYPE_RULES = [
    { selector: 'typeAlias', format: ['PascalCase'] },
    { selector: 'interface', format: ['PascalCase'] },
]

export const NAMING_CONVENTION_FUNCTION_RULES = [
    { selector: 'function', format: ['camelCase'], leadingUnderscore: 'allow' },

    // 判断函数
    {
        selector: 'function',
        format: ['camelCase'],
        custom: { regex: '^(is|has|can|should|will|did)[A-Z]', match: true },
    },

    // 工厂/创建函数
    {
        selector: 'function',
        format: ['camelCase'],
        custom: { regex: '^(create|build|make|new)[A-Z]', match: true },
    },

    // 转换函数
    {
        selector: 'function',
        format: ['camelCase'],
        custom: { regex: '^(to|from|parse|format|convert)[A-Z]', match: true },
    },

    // 事件处理函数
    {
        selector: 'function',
        format: ['camelCase'],
        custom: { regex: '^(handle|on)[A-Z]', match: true },
    },
]

export const NAMING_CONVENTION_OBJECT_RULES = [
    {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
    },
    { selector: 'property', format: ['camelCase'], leadingUnderscore: 'allow' },
    { selector: 'property', modifiers: ['requiresQuotes'], format: null },
    { selector: 'method', format: ['camelCase'], leadingUnderscore: 'allow' },
]

export const NAMING_CONVENTION_CLASS_RULES = [
    { selector: 'class', format: ['PascalCase'] },
    { selector: 'enum', format: ['PascalCase'] },
    { selector: 'enumMember', format: ['UPPER_CASE'] },
    {
        selector: 'typeParameter',
        format: ['PascalCase'],
        custom: { regex: '^(T|[A-Z]|T[A-Z][a-zA-Z]+)$', match: true },
    },
]
