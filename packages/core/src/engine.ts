/**
 * @file keybound core - 键盘引擎
 *
 * 用途：框架无关的键盘快捷键引擎核心。
 * 封装 Registry + HandlerChain + 事件监听，提供简洁的 API。
 *
 * 设计模式：
 * - 注册表模式：管理快捷键生命周期
 * - 责任链模式：按优先级调度
 * - 观察者模式：Registry → Chain 同步
 *
 * @public
 */
import { createHandlerChain } from './handlerChain'
import { getShortcutRegistry } from './registry'
import { shortcutKey } from './keyUtils'

import type {
    EngineConfig,
    HandlerChain,
    KeyBinding,
    ShortcutKey,
    ShortcutScope,
} from './types'

// ========== 内部单例 ==========

let defaultEngine: KeyboardEngine | null = null
let onKeyCounter = 0

function getDefaultEngine(): KeyboardEngine {
    defaultEngine ??= new KeyboardEngine()
    return defaultEngine
}

// ========== 快捷键引擎 ==========

/**
 * 键盘引擎
 *
 * 职责：
 * - 在 document 上监听 keydown 事件
 * - 通过 HandlerChain 按优先级调度
 * - 自动同步 Registry 中指定 scope 的快捷键
 *
 * 状态管理：Engine 内部维护 enabled 状态，Registry 只存储 KeyBinding 定义。
 */
class KeyboardEngine {
    private readonly chain: HandlerChain
    private readonly registry
    private readonly scopeSet: ReadonlySet<ShortcutScope>
    private readonly skipEditable: boolean

    /** id → enabled 状态（Engine 内部管理） */
    private readonly enabledMap = new Map<string, boolean>()

    /** 节点移除函数映射 */
    private readonly nodeMap = new Map<string, () => void>()

    /** 是否已挂载 */
    private mounted = false

    /** 变更监听取消函数 */
    private cancelWatch: (() => void) | null = null

    /** 事件处理器绑定 */
    private readonly handleKeydown = this._onKeydown.bind(this)

    constructor(config: EngineConfig = {}) {
        const {
            scopes = ['global'],
            skipEditable = true,
            debug = false,
        } = config
        this.scopeSet = new Set(scopes)
        this.skipEditable = skipEditable
        this.chain = createHandlerChain()
        // 在构造器内初始化，确保 debug 只生效一次
        this.registry = getShortcutRegistry({ debug })
    }

    // ========== 生命周期 ==========

    /**
     * 挂载引擎（开始监听键盘事件）
     *
     * 建议在应用初始化时调用一次。
     */
    mount(): void {
        if (this.mounted) return
        this.mounted = true

        // 初始同步
        for (const entry of this.registry.getAll()) {
            if (
                this.scopeSet.has(entry.scope ?? 'global') &&
                this.enabledMap.get(entry.id) !== false
            ) {
                this._syncEntry(entry)
            }
        }

        // 监听变更
        this.cancelWatch = this.registry.onChange((type, entry) => {
            if (!this.scopeSet.has(entry.scope ?? 'global')) return

            if (type === 'register') {
                this._syncEntry(entry)
            } else {
                this.enabledMap.delete(entry.id)
                this._removeEntry(entry.id)
            }
        })

        document.addEventListener('keydown', this.handleKeydown)
    }

    /**
     * 卸载引擎（停止监听）
     *
     * 清理所有注册的快捷键和事件监听。
     */
    dispose(): void {
        if (!this.mounted) return
        this.mounted = false

        this.cancelWatch?.()
        this.cancelWatch = null

        document.removeEventListener('keydown', this.handleKeydown)

        this.chain.clear()
        this.nodeMap.clear()
        this.enabledMap.clear()
    }

    // ========== 注册/注销 ==========

    /**
     * 注册快捷键
     *
     * @param entry 注册配置
     * @returns 注销函数
     */
    register(entry: KeyBinding): () => void {
        // 不覆盖已有的 enabled 状态，避免 mount 后注册 enabled:false 被覆盖成 true
        if (!this.enabledMap.has(entry.id)) {
            this.enabledMap.set(entry.id, entry.enabled !== false)
        }
        return this.registry.register(entry)
    }

    /**
     * 注销快捷键
     * @param id
     */
    unregister(id: string): void {
        this.enabledMap.delete(id)
        this.registry.unregister(id)
    }

    // ========== 查询 ==========

    /** 获取所有已注册快捷键 */
    getAll(): ReadonlyArray<KeyBinding> {
        return this.registry.getAll()
    }

    /** 按作用域获取快捷键 */
    getByScope(scope: ShortcutScope): ReadonlyArray<KeyBinding> {
        return this.registry.getByScope(scope)
    }

    /** 获取冲突的快捷键 */
    getConflicts(key: ShortcutKey): ReadonlyArray<KeyBinding> {
        return this.registry.getConflicts(key)
    }

    /** 获取处理链节点（用于调试） */
    getChainNodes(): ReadonlyArray<{
        id: string
        key: ShortcutKey
        priority: number
    }> {
        return this.chain.getNodes().map((n) => ({
            id: n.id,
            key: n.key,
            priority: n.priority,
        }))
    }

    // ========== 内部方法 ==========

    private _syncEntry(entry: KeyBinding): void {
        if (this.enabledMap.get(entry.id) === false) return

        const remove = this.chain.addNode({
            id: entry.id,
            key: entry.key,
            scope: entry.scope ?? 'global',
            handler: entry.handler,
            preventDefault: entry.preventDefault ?? true,
            priority: entry.priority ?? 0,
        })
        this.nodeMap.set(entry.id, remove)
    }

    private _removeEntry(id: string): void {
        this.nodeMap.get(id)?.()
        this.nodeMap.delete(id)
    }

    private _onKeydown(e: KeyboardEvent): void {
        if (this.skipEditable && this._isEditableTarget(e.target)) {
            return
        }

        this.chain.dispatch(e)
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

// ========== 统一导出 ==========

export { KeyboardEngine, onKey }

/**
 * 注册快捷键（最简 API）
 *
 * 自动创建并管理 Engine，无需手动 mount/dispose。
 *
 * @param key 快捷键，如 'Ctrl+S' 或 'c'
 * @param handler 按键时的回调
 * @returns 注销函数，调用后此快捷键失效
 *
 * @example
 * const unregister = onKey('c', () => showDialog())
 * unregister() // 注销
 */
function onKey(key: string, handler: (e: KeyboardEvent) => void): () => void {
    const engine = getDefaultEngine()
    // 使用计数器确保每次调用的 ID 唯一
    const id = `onKey:${++onKeyCounter}`
    const sk = shortcutKey(key)

    engine.mount()

    return engine.register({
        id,
        key: sk,
        handler,
        label: key,
    })
}
