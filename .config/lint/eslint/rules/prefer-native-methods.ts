/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Rule } from 'eslint'

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: '强制使用原生方法而非自定义实现',
            recommended: true,
        },
        messages: {
            useNumberIsNaN: '使用 Number.isNaN() 而非 value !== value 检查 NaN',
            useStructuredClone:
                '使用 structuredClone() 而非 JSON.parse(JSON.stringify())',
            useStringIncludes:
                '使用 String.prototype.includes() 而非 indexOf() !== -1',
        },
        schema: [],
    },

    create(context) {
        return {
            BinaryExpression(node: any) {
                if (
                    node.operator === '!==' &&
                    node.left.type === 'Identifier' &&
                    node.right.type === 'Identifier' &&
                    node.left.name === node.right.name
                ) {
                    context.report({ node, messageId: 'useNumberIsNaN' })
                }

                if (
                    (node.operator === '!==' || node.operator === '===') &&
                    node.right.type === 'UnaryExpression' &&
                    node.right.operator === '-' &&
                    node.right.argument.type === 'Literal' &&
                    node.right.argument.value === 1 &&
                    node.left.type === 'CallExpression' &&
                    node.left.callee.type === 'MemberExpression' &&
                    node.left.callee.property.type === 'Identifier' &&
                    node.left.callee.property.name === 'indexOf'
                ) {
                    context.report({ node, messageId: 'useStringIncludes' })
                }
            },

            CallExpression(node: any) {
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'JSON' &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'parse' &&
                    node.arguments.length === 1 &&
                    node.arguments[0].type === 'CallExpression' &&
                    node.arguments[0].callee.type === 'MemberExpression' &&
                    node.arguments[0].callee.object.type === 'Identifier' &&
                    node.arguments[0].callee.object.name === 'JSON' &&
                    node.arguments[0].callee.property.type === 'Identifier' &&
                    node.arguments[0].callee.property.name === 'stringify'
                ) {
                    context.report({ node, messageId: 'useStructuredClone' })
                }
            },
        }
    },
}

export default rule
