/**
 * @file keybound core - 快捷键注册表
 *
 * 用途：统一管理快捷键的注册、注销、冲突检测、查询。
 *
 * 设计模式：
 * - 单例模式：全局唯一注册表实例
 * - 注册表模式：动态注册/注销
 * - 观察者模式：变更通知
 *
 * @public
 */
import type { KeyBinding, ShortcutKey, ShortcutScope } from './types'

// ========== 注册表实现 ==========

/**
 * 快捷键注册表
 *
 * 支持按作用域分组、冲突警告。
 *
 * @param options.debug - 是否输出冲突警告（默认 false）
 */
class ShortcutRegistry {
    private readonly debug: boolean
    private readonly entries = new Map<string, KeyBinding>()
    private readonly keyIndex = new Map<ShortcutKey, Set<string>>()
    private readonly listeners = new Set<
        (type: 'register' | 'unregister', entry: KeyBinding) => void
    >()

    constructor(options: { debug?: boolean } = {}) {
        this.debug = options.debug ?? false
    }

    /**
     * 注册快捷键
     *
     * @param entry 注册条目
     * @returns 注销函数
     */
    register(entry: KeyBinding): () => void {
        const { id, key } = entry

        // 复用 ID 时，先清除旧 entry
        const old = this.entries.get(id)
        if (old) {
            const oldIds = this.keyIndex.get(old.key)
            if (oldIds) {
                oldIds.delete(id)
                if (oldIds.size === 0) {
                    this.keyIndex.delete(old.key)
                }
            }
            this._notify('unregister', old)
        }

        // 冲突检测
        if (this.debug) {
            const conflicts = this.getConflicts(key)
            if (conflicts.length > 0) {
                const conflictIds = conflicts.map((c) => c.id).join(', ')
                console.warn(
                    `[ShortcutRegistry] Conflict detected: "${id}" (${key}) conflicts with: ${conflictIds}`,
                )
            }
        }

        this.entries.set(id, entry)

        const ids = this.keyIndex.get(key) ?? new Set()
        ids.add(id)
        this.keyIndex.set(key, ids)

        this._notify('register', entry)

        return () => this.unregister(id)
    }

    /**
     * 注销快捷键
     * @param id
     */
    unregister(id: string): void {
        const entry = this.entries.get(id)
        if (!entry) return

        this.entries.delete(id)

        const ids = this.keyIndex.get(entry.key)
        if (ids) {
            ids.delete(id)
            if (ids.size === 0) {
                this.keyIndex.delete(entry.key)
            }
        }

        this._notify('unregister', entry)
    }

    /** 获取所有已注册快捷键 */
    getAll(): ReadonlyArray<KeyBinding> {
        return [...this.entries.values()]
    }

    /**
     * 按作用域获取快捷键
     * @param scope
     */
    getByScope(scope: ShortcutScope): ReadonlyArray<KeyBinding> {
        return this.getAll().filter((e) => (e.scope ?? 'global') === scope)
    }

    /**
     * 获取与指定快捷键冲突的条目
     * @param key
     */
    getConflicts(key: ShortcutKey): ReadonlyArray<KeyBinding> {
        const ids = this.keyIndex.get(key)
        if (!ids || ids.size === 0) return []
        return [...ids].flatMap((id) => {
            const entry = this.entries.get(id)
            return entry ? [entry] : []
        })
    }

    /**
     * 检查快捷键是否已注册
     * @param key
     * @param scope
     */
    has(key: ShortcutKey, scope?: ShortcutScope): boolean {
        const conflicts = this.getConflicts(key)
        if (!scope) return conflicts.length > 0
        return conflicts.some((e) => (e.scope ?? 'global') === scope)
    }

    /**
     * 监听注册/注销事件
     *
     * @param listener
     * @returns 取消监听函数
     */
    onChange(
        listener: (type: 'register' | 'unregister', entry: KeyBinding) => void,
    ): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    /** 清空所有注册 */
    clear(): void {
        this.entries.clear()
        this.keyIndex.clear()
    }

    private _notify(type: 'register' | 'unregister', entry: KeyBinding): void {
        for (const fn of this.listeners) fn(type, entry)
    }
}

// ========== 单例 ==========

let registryInstance: ShortcutRegistry | null = null

/**
 * 获取全局快捷键注册表实例（单例）
 *
 * 首次调用时创建实例，后续调用返回同一实例。
 * @param options.debug - 冲突警告（首次调用生效）
 */
function getShortcutRegistry(options?: { debug?: boolean }): ShortcutRegistry {
    registryInstance ??= new ShortcutRegistry(options)
    return registryInstance
}

// ========== 统一导出 ==========

export { ShortcutRegistry, getShortcutRegistry }
