/**
 * @file keybound core - 序列键管理器
 *
 * 状态机：Idle → Pending → Executing → Idle
 *
 * @public
 */
import type {
    SequenceBinding,
    SequenceManager,
    SequenceStatus,
    ShortcutKey,
} from './types'

import { DEFAULT_CANCEL_KEY, DEFAULT_SEQUENCE_TIMEOUT } from './types'
import type { KeyHandler } from './types'

interface PendingSequence {
    id: string
    keys: ShortcutKey[]
    keyIndex: number
    handler: KeyHandler
    preventDefault: boolean
    when?: (() => boolean) | undefined
    timeout: number
    cancelKey: ShortcutKey
}

function createSequenceManager(): SequenceManager {
    const sequencesByTrigger = new Map<ShortcutKey, Set<PendingSequence>>()
    let activeTrigger: ShortcutKey | null = null
    let status: SequenceStatus = 'idle'
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null
    let pendingEnteredAt = 0

    function clearTimeoutTimer(): void {
        if (timeoutTimer !== null) {
            clearTimeout(timeoutTimer)
            timeoutTimer = null
        }
    }

    function getActiveSequences(): Set<PendingSequence> {
        if (!activeTrigger) return new Set()
        return sequencesByTrigger.get(activeTrigger) ?? new Set()
    }

    function cancelAllInternal(): void {
        clearTimeoutTimer()
        activeTrigger = null
        status = 'idle'
        pendingEnteredAt = 0
    }

    function startTimer(seq: PendingSequence): void {
        clearTimeoutTimer()
        pendingEnteredAt = Date.now()
        timeoutTimer = globalThis.setTimeout(() => {
            if (status === 'pending') {
                cancelAllInternal()
            }
        }, seq.timeout)
    }

    function execute(seq: PendingSequence, e: KeyboardEvent): void {
        if (seq.when && !seq.when()) {
            seq.keyIndex = 1
            startTimer(seq)
            return
        }
        status = 'executing'
        if (seq.preventDefault) {
            e.preventDefault()
        }
        seq.handler(e)
        status = 'idle'
        activeTrigger = null
        clearTimeoutTimer()
    }

    function advanceSequence(seq: PendingSequence, e: KeyboardEvent): void {
        seq.keyIndex++
        if (seq.keyIndex === seq.keys.length) {
            clearTimeoutTimer()
            execute(seq, e)
        } else {
            startTimer(seq)
        }
    }

    function handlePendingState(
        e: KeyboardEvent,
        pressed: ShortcutKey,
        modKey: boolean,
        seqArr: PendingSequence[],
    ): boolean {
        const firstSeq = seqArr[0]
        if (firstSeq) {
            const isCustomCancel = firstSeq.cancelKey !== DEFAULT_CANCEL_KEY
            const pressedIsCustom = pressed === firstSeq.cancelKey
            const pressedIsDefault = pressed === DEFAULT_CANCEL_KEY

            if (pressedIsCustom) {
                e.preventDefault()
                cancelAllInternal()
                return true
            }

            if (!isCustomCancel && pressedIsDefault) {
                e.preventDefault()
                cancelAllInternal()
                return true
            }
        }

        for (const seq of seqArr) {
            const expectedKey = seq.keys[seq.keyIndex]
            if (expectedKey && pressed === expectedKey) {
                advanceSequence(seq, e)
                return true
            }
        }

        if (!modKey) {
            cancelAllInternal()
        }
        return false
    }

    function register(binding: SequenceBinding): () => void {
        const trigger = binding.keys[0]
        if (!trigger) return () => {}

        const seq: PendingSequence = {
            id: binding.id,
            keys: binding.keys,
            keyIndex: 1,
            handler: binding.handler,
            preventDefault: binding.preventDefault ?? true,
            when: binding.when,
            timeout: binding.timeout ?? DEFAULT_SEQUENCE_TIMEOUT,
            cancelKey: binding.cancelKey ?? DEFAULT_CANCEL_KEY,
        }

        let set = sequencesByTrigger.get(trigger)
        if (!set) {
            set = new Set()
            sequencesByTrigger.set(trigger, set)
        }

        for (const existing of set) {
            if (existing.id === binding.id) {
                set.delete(existing)
                break
            }
        }

        set.add(seq)

        return () => unregister(binding.id)
    }

    function unregister(id: string): void {
        for (const set of sequencesByTrigger.values()) {
            for (const seq of set) {
                if (seq.id === id) {
                    set.delete(seq)
                    if (set.size === 0) {
                        sequencesByTrigger.delete(seq.keys[0] as ShortcutKey)
                    }
                    if (activeTrigger === seq.keys[0]) {
                        cancelAllInternal()
                    }
                    return
                }
            }
        }
    }

    function onKeydown(
        e: KeyboardEvent,
        buildKey: (e: KeyboardEvent) => ShortcutKey,
    ): boolean {
        const pressed = buildKey(e)
        const modKey = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey

        if (status === 'executing') {
            return true
        }

        if (status === 'idle') {
            const set = sequencesByTrigger.get(pressed)
            if (set && set.size > 0) {
                activeTrigger = pressed
                status = 'pending'
                const firstSeqArr = [...set]
                const firstSeq = firstSeqArr[0]
                if (firstSeq) {
                    e.preventDefault()
                    startTimer(firstSeq)
                }
                return true
            }
            return false
        }

        return handlePendingState(e, pressed, modKey, [...getActiveSequences()])
    }

    function hasActiveSequence(): boolean {
        return status === 'pending' && activeTrigger !== null
    }

    function getRemainingTime(): number {
        if (status !== 'pending' || !pendingEnteredAt) return 0
        return pendingEnteredAt > 0 ? 1 : 0
    }

    function getActiveTriggerKeys(): ShortcutKey[] {
        if (status !== 'idle') return []
        return [...sequencesByTrigger.keys()]
    }

    function cancelAll(): void {
        cancelAllInternal()
    }

    function getStatus(): SequenceStatus {
        return status
    }

    function dispose(): void {
        cancelAllInternal()
        sequencesByTrigger.clear()
    }

    return {
        register,
        unregister,
        onKeydown,
        hasActiveSequence,
        getRemainingTime,
        getActiveTriggerKeys,
        cancelAll,
        getStatus,
        dispose,
    }
}

export { createSequenceManager }
export type { SequenceManager }
