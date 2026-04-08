/**
 * @file keybound core - 纯工具函数
 *
 * 用途：修饰符检测、按键字符串构建、品牌类型工厂。
 * 纯原生 TS，无任何框架依赖。
 *
 * @public
 */
import { MODIFIER_ORDER } from './types'

import type { Modifier, ShortcutKey } from './types'

// ========== 修饰符检测 ==========

/** 判断事件是否包含修饰键 */
function hasModifier(e: KeyboardEvent) {
    return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
}

/** 判断是否按下主修饰键（Ctrl 或 Cmd） */
function isModifierKey(e: KeyboardEvent) {
    return e.ctrlKey || e.metaKey
}

// ========== 目标检测 ==========

/** 判断事件目标是否为可编辑元素 */
function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    const { tagName } = target
    return (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        target.isContentEditable
    )
}

// ========== 按键字符串构建 ==========

/**
 * 构建按键字符串（包含修饰键）
 *
 * 修饰键顺序固定：Ctrl > Shift > Alt > Meta
 */
function buildKeyString(e: KeyboardEvent) {
    const parts: string[] = []

    if (e.ctrlKey) parts.push('Ctrl')
    if (e.shiftKey) parts.push('Shift')
    if (e.altKey) parts.push('Alt')
    if (e.metaKey) parts.push('Meta')

    parts.push(e.key)

    return parts.join('+')
}

// ========== 快捷键品牌类型工厂 ==========

/**
 * 创建类型安全的 ShortcutKey
 *
 * 修饰符必须按 Ctrl > Shift > Alt > Meta 顺序排列。
 *
 * @param raw 原始快捷键字符串，如 'Ctrl+Shift+S'
 * @throws 修饰符顺序不正确时抛出错误
 */
function shortcutKey(raw: string): ShortcutKey {
    const parts = raw.split('+')
    const modifiers = parts.slice(0, -1)

    let lastIndex = -1
    for (const mod of modifiers) {
        const currentIndex = MODIFIER_ORDER.indexOf(mod as Modifier)
        if (currentIndex === -1) {
            throw new Error(
                `Unknown modifier: ${mod}. Valid modifiers: ${MODIFIER_ORDER.join(', ')}`,
            )
        }
        if (currentIndex <= lastIndex) {
            throw new Error(
                `Invalid modifier order in "${raw}". Expected order: ${MODIFIER_ORDER.join(' > ')}`,
            )
        }
        lastIndex = currentIndex
    }

    return raw as ShortcutKey
}

// ========== 统一导出 ==========

export {
    hasModifier,
    isModifierKey,
    isEditableTarget,
    buildKeyString,
    shortcutKey,
}
