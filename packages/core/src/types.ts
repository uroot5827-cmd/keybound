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

/** 按键处理器（返回 false 表示继续传播） */
type KeyHandler = (e: KeyboardEvent) => void | boolean

/** 快捷键作用域 */
type ShortcutScope =
    | 'global'
    | 'form'
    | 'list'
    | 'dropdown'
    | 'edit'
    | (string & {})

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
    /** 显示标签 */
    label: string
    /** 详细描述 */
    description?: string
    /** 分类（用于菜单分组） */
    category?: string
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
}

// ========== 处理链 API ==========

/** 处理链 API */
interface HandlerChain {
    addNode(node: HandlerChainNode): () => void
    dispatch(e: KeyboardEvent): void
    getNodes(): ReadonlyArray<HandlerChainNode>
    clear(): void
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

// ========== 统一导出 ==========

export type {
    Modifier,
    ShortcutKey,
    KeyHandler,
    ShortcutScope,
    KeyBinding,
    HandlerChainNode,
    EngineConfig,
    HandlerChain,
}

export { MODIFIER_ORDER }
