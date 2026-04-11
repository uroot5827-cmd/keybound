/**
 * @file keybound core - 键盘引擎
 *
 * 用途：框架无关的键盘快捷键引擎核心。
 * 封装 Registry + HandlerChain + SequenceManager + 事件监听。
 *
 * 设计模式：
 * - 注册表模式：管理快捷键生命周期
 * - 责任链模式：按优先级调度
 * - 状态机模式：序列键状态管理
 * - 观察者模式：Registry → Chain 同步
 *
 * @public
 */
import { createHandlerChain } from './handlerChain'
import { getShortcutRegistry } from './registry'
import { shortcutKey } from './keyUtils'
import { createSequenceManager } from './sequenceManager'

import type {
    BindOptions,
    EngineConfig,
    HandlerChain,
    HandlerChainNode,
    KeyBinding,
    KeyHandler,
    KeyMode,
    SequenceBinding,
    SequenceStatus,
    ShortcutKey,
    ShortcutScope,
} from './types'

// ========== 内部单例 ==========

let defaultEngine: KeyboardEngine | null = null
let idCounter = 0

function nextId(prefix: string): string {
    return `${prefix}:${++idCounter}`
}

function getDefaultEngine(): KeyboardEngine {
    defaultEngine ??= new KeyboardEngine()
    return defaultEngine
}

// ========== 数字前缀管理器 ==========

class CountManager {
    private count = 0
    private timer: ReturnType<typeof setTimeout> | null = null
    private readonly timeout: number

    constructor(timeout = 500) {
        this.timeout = timeout
    }

    onDigit(e: KeyboardEvent): boolean {
        const digit = this._parseDigit(e)
        if (digit === null) return false

        this.count = this.count * 10 + digit
        this._resetTimer()
        e.preventDefault()
        return true
    }

    consume(): number {
        const result = this.count || 1
        this.count = 0
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        return result
    }

    peek(): number {
        return this.count || 1
    }

    hasCount(): boolean {
        return this.count > 0
    }

    dispose(): void {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        this.count = 0
    }

    private _parseDigit(e: KeyboardEvent): number | null {
        if (e.key >= '0' && e.key <= '9') {
            if (e.ctrlKey || e.altKey || e.metaKey) return null
            return Number.parseInt(e.key, 10)
        }
        return null
    }

    private _resetTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.count = 0
        }, this.timeout)
    }
}

// ========== 快捷键引擎 ==========

class KeyboardEngine {
    private readonly keydownChain: HandlerChain
    private readonly keyupChain: HandlerChain
    private readonly registry
    private readonly scopeSet: ReadonlySet<ShortcutScope>
    private readonly skipEditable: boolean
    private readonly seqManager: ReturnType<typeof createSequenceManager>
    private readonly countManager: CountManager
    private keyMode: KeyMode

    private readonly stateMap = new Map<
        string,
        { enabled: boolean; when: (() => boolean) | undefined }
    >()

    private readonly nodeMap = new Map<string, () => void>()

    private mounted = false
    private paused = false
    private cancelWatch: (() => void) | null = null
    private readonly handleKeydown = this._onKeydown.bind(this)
    private readonly handleKeyup = this._onKeyup.bind(this)

    constructor(config: EngineConfig = {}) {
        const {
            scopes = ['global'],
            skipEditable = true,
            debug = false,
            keyMode = 'logical',
        } = config
        this.scopeSet = new Set(scopes)
        this.skipEditable = skipEditable
        this.keyMode = keyMode
        this.keydownChain = createHandlerChain()
        this.keyupChain = createHandlerChain()
        this.seqManager = createSequenceManager()
        this.countManager = new CountManager()
        this.registry = getShortcutRegistry({ debug })
    }

    mount(): void {
        if (this.mounted) return
        this.mounted = true

        for (const entry of this.registry.getAll()) {
            this._syncEntry(entry)
        }

        this.cancelWatch = this.registry.onChange((type, entry) => {
            if (!this.scopeSet.has(entry.scope ?? 'global')) return

            if (type === 'register') {
                this._syncEntry(entry)
            } else {
                this.stateMap.delete(entry.id)
                this._removeEntry(entry.id)
            }
        })

        document.addEventListener('keydown', this.handleKeydown)
        document.addEventListener('keyup', this.handleKeyup)
    }

    dispose(): void {
        if (!this.mounted) return
        this.mounted = false

        this.cancelWatch?.()
        this.cancelWatch = null

        document.removeEventListener('keydown', this.handleKeydown)
        document.removeEventListener('keyup', this.handleKeyup)

        this.keydownChain.clear()
        this.keyupChain.clear()
        this.nodeMap.clear()
        this.seqManager.dispose()
        this.countManager.dispose()
        this.stateMap.clear()
    }

    pause(): void {
        this.paused = true
    }

    resume(): void {
        this.paused = false
    }

    setKeyMode(mode: KeyMode): void {
        this.keyMode = mode
    }

    register(entry: KeyBinding): () => void {
        if (!this.stateMap.has(entry.id)) {
            this.stateMap.set(entry.id, {
                enabled: entry.enabled !== false,
                when: entry.when,
            })
        }
        return this.registry.register(entry)
    }

    registerSequence(binding: SequenceBinding): () => void {
        return this.seqManager.register(binding)
    }

    registerChord(
        binding: Omit<SequenceBinding, 'id'> & { id?: string },
    ): () => void {
        const id = binding.id ?? nextId('onSequence')
        return this.seqManager.register({ ...binding, id } as SequenceBinding)
    }

    unregister(id: string): void {
        this.stateMap.delete(id)
        this.registry.unregister(id)
        this.seqManager.unregister(id)
    }

    cancelSequences(): void {
        this.seqManager.cancelAll()
    }

    getAll(): ReadonlyArray<KeyBinding> {
        return this.registry.getAll()
    }

    getByScope(scope: ShortcutScope): ReadonlyArray<KeyBinding> {
        return this.registry.getByScope(scope)
    }

    getConflicts(key: ShortcutKey): ReadonlyArray<KeyBinding> {
        return this.registry.getConflicts(key)
    }

    hasActiveSequence(): boolean {
        return this.seqManager.hasActiveSequence()
    }

    getSequenceStatus(): SequenceStatus {
        return this.seqManager.getStatus()
    }

    private _syncEntry(entry: KeyBinding): void {
        if (this._shouldSkip(entry)) return

        const chain =
            entry.event === 'keyup' ? this.keyupChain : this.keydownChain
        const node: HandlerChainNode = {
            id: entry.id,
            key: entry.key,
            scope: entry.scope ?? 'global',
            handler: entry.handler,
            preventDefault: entry.preventDefault ?? true,
            priority: entry.priority ?? 0,
            count: entry.count ?? false,
            event: entry.event ?? 'keydown',
            ...(entry.when !== undefined && { when: entry.when }),
        }
        const remove = chain.addNode(node)
        this.nodeMap.set(entry.id, remove)
    }

    private _shouldSkip(entry: KeyBinding): boolean {
        const state = this.stateMap.get(entry.id)
        if (state?.enabled === false) return true
        if (state?.when && !state.when()) return true
        if (!this.scopeSet.has(entry.scope ?? 'global')) return true
        return false
    }

    private _removeEntry(id: string): void {
        this.nodeMap.get(id)?.()
        this.nodeMap.delete(id)
    }

    private _onKeydown(e: KeyboardEvent): void {
        if (this.paused) return
        if (this.skipEditable && this._isEditableTarget(e.target)) {
            return
        }

        this._buildKey(e)

        const handledBySequence = this.seqManager.onKeydown(e, (evt) =>
            this._buildKey(evt),
        )

        if (handledBySequence) {
            return
        }

        if (this.countManager.onDigit(e)) {
            return
        }

        const repeatCount = this.countManager.consume()

        this._dispatchWithWildcard(this.keydownChain, e, repeatCount)
    }

    private _onKeyup(e: KeyboardEvent): void {
        if (this.paused) return
        if (this.skipEditable && this._isEditableTarget(e.target)) {
            return
        }

        this._dispatchWithWildcard(this.keyupChain, e, 1)
    }

    private _dispatchWithWildcard(
        chain: HandlerChain,
        e: KeyboardEvent,
        repeatCount: number,
    ): void {
        const keyString = this._buildKey(e)
        const normalizedKey = keyString.toUpperCase()
        const nodes = [...chain.getNodes()]

        const orderedMatches = this._categorizeNodes(nodes, normalizedKey)

        for (const node of orderedMatches) {
            if (node.when && !node.when()) continue

            const result = node.count
                ? node.handler(e, repeatCount)
                : node.handler(e)

            if (result === false) continue

            if (node.preventDefault) {
                e.preventDefault()
            }
            return
        }
    }

    private _categorizeNodes(
        nodes: HandlerChainNode[],
        normalizedKey: string,
    ): HandlerChainNode[] {
        const exactMatches: HandlerChainNode[] = []
        const wildcardMatches: HandlerChainNode[] = []

        for (const node of nodes) {
            const nodeKey = (node.key as string).toUpperCase()
            if (this._isWildcardPattern(nodeKey)) {
                if (this._wildcardMatches(nodeKey, normalizedKey)) {
                    wildcardMatches.push(node)
                }
            } else if (nodeKey === normalizedKey) {
                exactMatches.push(node)
            }
        }

        return [...exactMatches, ...wildcardMatches]
    }

    private _isWildcardPattern(nodeKey: string): boolean {
        return nodeKey.endsWith('+*') || nodeKey === '*'
    }

    private _wildcardMatches(pattern: string, actual: string): boolean {
        if (pattern === '*') return true

        const patternParts = pattern.split('+')
        const actualParts = actual.split('+')

        const wildcardIndex = patternParts.indexOf('*')
        if (wildcardIndex === -1) return pattern === actual

        for (let i = 0; i < wildcardIndex; i++) {
            if (patternParts[i] !== actualParts[i]) return false
        }

        return true
    }

    private _buildKey(e: KeyboardEvent): ShortcutKey {
        const parts: string[] = []

        if (e.ctrlKey) parts.push('Ctrl')
        if (e.shiftKey) parts.push('Shift')
        if (e.altKey) parts.push('Alt')
        if (e.metaKey) parts.push('Meta')

        const key = this.keyMode === 'physical' ? e.code : e.key
        parts.push(key)

        return parts.join('+') as ShortcutKey
    }

    private _isEditableTarget(target: EventTarget | null): boolean {
        if (!(target instanceof HTMLElement)) return false
        const { tagName } = target
        return (
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            target.isContentEditable
        )
    }
}

export { KeyboardEngine, onKey, onSequence, onChord }

export type { SequenceStatus }

function onKey(
    key: string,
    handler: KeyHandler,
    options?: BindOptions,
): () => void {
    const engine = getDefaultEngine()
    const id = nextId('onKey')
    const sk = shortcutKey(key)

    engine.mount()

    const entry: KeyBinding = {
        id,
        key: sk,
        handler,
        label: key,
        ...(options?.preventDefault !== undefined && {
            preventDefault: options.preventDefault,
        }),
        ...(options?.when !== undefined && { when: options.when }),
        ...(options?.count !== undefined && { count: options.count }),
        ...(options?.event !== undefined && { event: options.event }),
    }
    return engine.register(entry)
}

function onSequence(
    keys: string[],
    handler: KeyHandler,
    options?: {
        timeout?: number
        preventDefault?: boolean
        when?(): boolean
        cancelKey?: string
    },
): () => void {
    const engine = getDefaultEngine()
    const id = nextId('onSequence')
    const shortcutKeys = keys.map((k) => shortcutKey(k))

    engine.mount()

    const binding: SequenceBinding = {
        id,
        keys: shortcutKeys,
        handler,
        ...(options?.timeout !== undefined && { timeout: options.timeout }),
        ...(options?.preventDefault !== undefined && {
            preventDefault: options.preventDefault,
        }),
        ...(options?.when !== undefined && { when: options.when }),
        ...(options?.cancelKey !== undefined && {
            cancelKey: shortcutKey(options.cancelKey),
        }),
    }
    return engine.registerSequence(binding)
}

function onChord(
    keys: string[],
    handler: KeyHandler,
    options?: {
        timeout?: number
        preventDefault?: boolean
        when?(): boolean
    },
): () => void {
    return onSequence(keys, handler, options)
}
