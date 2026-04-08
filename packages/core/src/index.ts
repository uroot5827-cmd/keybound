/**
 * @file keybound core package entry
 *
 * @public
 */

// 引擎
export { KeyboardEngine, onKey } from './engine'

// 注册表
export { getShortcutRegistry, ShortcutRegistry } from './registry'

// 责任链
export { createHandlerChain } from './handlerChain'
export type { HandlerChain } from './types'

// 工具函数
export {
    buildKeyString,
    shortcutKey,
    hasModifier,
    isModifierKey,
    isEditableTarget,
} from './keyUtils'

// 类型
export type {
    Modifier,
    ShortcutKey,
    KeyHandler,
    ShortcutScope,
    KeyBinding,
    HandlerChainNode,
    EngineConfig,
} from './types'

// 常量
export { MODIFIER_ORDER } from './types'
