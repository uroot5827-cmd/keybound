/**
 * @file keybound core package - 类型定义
 *
 * @public
 */

// ========== 快捷键基础类型 ==========

/** 修饰键（顺序约定：Ctrl > Shift > Alt > Meta） */
type Modifier = 'Ctrl' | 'Shift' | 'Alt' | 'Meta'

/**
 * 快捷键品牌类型（编译时验证修饰符顺序）
 *
 * 用 `shortcutKey()` 函数创建。
 */
type ShortcutKey = string & { readonly _brand: 'ShortcutKey' }

/** 按键事件类型 */
type KeyEventType = 'keydown' | 'keyup'

/** 按键处理器（返回 false 表示继续传播） */
type KeyHandler = (e: KeyboardEvent, repeatCount?: number) => void | boolean

/** 快捷键作用域 */
type ShortcutScope =
    | 'global'
    | 'form'
    | 'list'
    | 'dropdown'
    | 'edit'
    | (string & {})

/** 键盘模式 */
type KeyMode = 'logical' | 'physical'

// ========== 选项对象 ==========

/** onKey / register 选项 */
interface BindOptions {
    /** 是否阻止浏览器默认行为（默认 true） */
    preventDefault?: boolean
    /** 触发条件，为 true 时才执行 */
    when?(): boolean
    /** 支持数字前缀（默认 false） */
    count?: boolean
    /** 事件类型：keydown 或 keyup（默认 keydown） */
    event?: KeyEventType
}

// ========== 快捷键绑定（注册 API）============

/**
 * 快捷键绑定（注册 API）
 *
 * 用户调用 `engine.register()` 时传入的类型。
 * 可选字段均有默认值：scope='global', priority=0, preventDefault=true, enabled=true。
 */
interface KeyBinding {
    /** 唯一标识 */
    id: string
    /** 快捷键（品牌类型） */
    key: ShortcutKey
    /** 按键处理器 */
    handler: KeyHandler
    /** 作用域（默认 'global'） */
    scope?: ShortcutScope
    /** 是否阻止浏览器默认行为（默认 true） */
    preventDefault?: boolean
    /** 优先级（高优先级先执行，默认 0） */
    priority?: number
    /** 是否启用（默认 true） */
    enabled?: boolean
    /** 触发条件，为 true 时才执行 */
    when?(): boolean
    /** 支持数字前缀（默认 false） */
    count?: boolean
    /** 事件类型：keydown 或 keyup（默认 keydown） */
    event?: KeyEventType
    /** 显示标签 */
    label: string
    /** 详细描述 */
    description?: string
    /** 分类（用于菜单分组） */
    category?: string
}

// ========== 序列键 ==========

/** 序列键状态机状态 */
type SequenceStatus = 'idle' | 'pending' | 'executing'

/**
 * 序列键绑定（注册 API）
 *
 * 按顺序按下多个键触发一个命令。
 * 支持 2 键 Chord（如 G→T）和多键序列（如 gg、d3w）。
 */
interface SequenceBinding {
    id: string
    /** 按键序列，如 ['g', 't']、['g', 'g']、['d', '3', 'w'] */
    keys: ShortcutKey[]
    handler: KeyHandler
    /** 序列超时（ms），默认 1000 */
    timeout?: number
    /** 是否阻止浏览器默认行为（默认 true） */
    preventDefault?: boolean
    /** 触发条件，为 true 时才执行 */
    when?(): boolean
    /** Cancel 键：按此键取消序列，默认 'Escape' */
    cancelKey?: ShortcutKey
}

// ========== 处理链节点（内部）============

/**
 * 处理链节点（Engine 内部使用）
 *
 * 从 KeyBinding 同步到 HandlerChain 时，所有字段必有值。
 */
interface HandlerChainNode {
    id: string
    key: ShortcutKey
    scope: ShortcutScope
    handler: KeyHandler
    preventDefault: boolean
    priority: number
    count: boolean
    event: KeyEventType
    when?(): boolean
}

// ========== 引擎配置 ==========

/** 引擎配置 */
interface EngineConfig {
    /** 要监听的作用域（默认 ['global']） */
    scopes?: ShortcutScope[]
    /** 是否跳过可编辑目标（默认 true） */
    skipEditable?: boolean
    /** 是否输出调试信息（默认 false） */
    debug?: boolean
    /** 键盘模式：logical 用 event.key，physical 用 event.code（默认 'logical'） */
    keyMode?: KeyMode
}

// ========== 处理链 API ==========

/** 处理链 API */
interface HandlerChain {
    addNode(node: HandlerChainNode): () => void
    dispatch(e: KeyboardEvent, repeatCount?: number): void
    getNodes(): ReadonlyArray<HandlerChainNode>
    clear(): void
}

// ========== 序列管理器 API ==========

/**
 * 序列管理器 API
 */
interface SequenceManager {
    register(binding: SequenceBinding): () => void
    unregister(id: string): void
    onKeydown(
        e: KeyboardEvent,
        buildKey: (e: KeyboardEvent) => ShortcutKey,
    ): boolean
    hasActiveSequence(): boolean
    getRemainingTime(): number
    getActiveTriggerKeys(): ShortcutKey[]
    cancelAll(): void
    getStatus(): SequenceStatus
    dispose(): void
}

// ========== 常量 ==========

/**
 * 修饰键标准顺序（Ctrl > Shift > Alt > Meta）
 *
 * buildKeyString 按此顺序拼接修饰键前缀。
 */
const MODIFIER_ORDER: readonly Modifier[] = [
    'Ctrl',
    'Shift',
    'Alt',
    'Meta',
] as const

/** 通配符常量 */
const WILDCARD = '*' as const

/** 默认序列超时（ms） */
const DEFAULT_SEQUENCE_TIMEOUT = 1000

/** 默认 cancel 键 */
const DEFAULT_CANCEL_KEY = 'Escape' as ShortcutKey

// ========== 统一导出 ==========

export type {
    Modifier,
    ShortcutKey,
    KeyEventType,
    KeyHandler,
    ShortcutScope,
    KeyMode,
    BindOptions,
    KeyBinding,
    SequenceBinding,
    SequenceStatus,
    HandlerChainNode,
    EngineConfig,
    HandlerChain,
    SequenceManager,
}

export {
    MODIFIER_ORDER,
    WILDCARD,
    DEFAULT_SEQUENCE_TIMEOUT,
    DEFAULT_CANCEL_KEY,
}
