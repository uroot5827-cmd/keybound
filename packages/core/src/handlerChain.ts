/**
 * @file keybound core - 责任链处理器
 *
 * 用途：按优先级调度快捷键处理器。
 *
 * 设计模式：责任链（Chain of Responsibility）
 * - 节点按 priority 降序排列
 * - dispatch 时从高优先级开始执行
 * - handler 返回 void/true 表示已处理（停止链）
 * - handler 返回 false 表示传递给下一个节点
 *
 * @public
 */
import { buildKeyString } from './keyUtils'

import type { HandlerChain, HandlerChainNode } from './types'

/**
 * 创建快捷键处理链
 */
function createHandlerChain(): HandlerChain {
    const nodes: HandlerChainNode[] = []

    function sortNodes(): void {
        nodes.sort((a, b) => b.priority - a.priority)
    }

    function addNode(node: HandlerChainNode): () => void {
        nodes.push(node)
        sortNodes()

        return () => {
            const index = nodes.indexOf(node)
            if (index >= 0) {
                nodes.splice(index, 1)
            }
        }
    }

    function dispatch(e: KeyboardEvent): void {
        const keyString = buildKeyString(e)

        // 大小写不敏感匹配（支持 Ctrl+A 和 Ctrl+a）
        const normalizedKey = keyString.toUpperCase()
        const matching = nodes.filter(
            (n) => (n.key as string).toUpperCase() === normalizedKey,
        )

        for (const node of matching) {
            const result = node.handler(e)

            // handler 返回 false 表示显式传递给下一个
            if (result === false) continue

            // 其他返回值（void/true）表示已处理
            if (node.preventDefault) {
                e.preventDefault()
            }
            return
        }
    }

    function getNodes(): ReadonlyArray<HandlerChainNode> {
        return nodes
    }

    function clear(): void {
        nodes.length = 0
    }

    return { addNode, dispatch, getNodes, clear }
}

// ========== 统一导出 ==========

export { createHandlerChain }
