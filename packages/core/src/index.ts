/**
 * @file keybound core package entry
 *
 * @public
 */

// 引擎
export { KeyboardEngine, onKey, onSequence, onChord } from './engine'
export type { SequenceStatus } from './engine'

// 注册表
export { getShortcutRegistry, ShortcutRegistry } from './registry'

// 责任链
export { createHandlerChain } from './handlerChain'
export type { HandlerChain } from './types'

// 序列管理器
export { createSequenceManager } from './sequenceManager'

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
    KeyEventType,
    KeyHandler,
    ShortcutScope,
    KeyMode,
    BindOptions,
    KeyBinding,
    SequenceBinding,
    HandlerChainNode,
    EngineConfig,
} from './types'

// 常量
export {
    MODIFIER_ORDER,
    DEFAULT_SEQUENCE_TIMEOUT,
    DEFAULT_CANCEL_KEY,
} from './types'
