# 序列键

序列键允许用户按顺序输入多个按键来触发动作，常见于 Vim 和 Linear 的操作体验。

## 基础用法

```typescript
import { KeyboardEngine } from '@keybound/core'

const engine = new KeyboardEngine()
engine.mount()

// 2键 Chord（g → t）
engine.registerSequence({
    id: 'goto-top',
    keys: ['g', 't'],
    handler: () => scrollToTop(),
})

// 重复首键（gg 跳转顶部）
engine.registerSequence({
    id: 'scroll-top',
    keys: ['g', 'g'],
    handler: () => scrollToTop(),
})

// 3+ 键序列
engine.registerSequence({
    id: 'delete-words',
    keys: ['d', '3', 'w'],
    handler: () => deleteWords(),
})
```

## 便捷 API

```typescript
import { onSequence } from '@keybound/core'

// 最简用法
onSequence(['g', 't'], () => openSettings())
onSequence(['g', 'g'], scrollToTop)
onSequence(['d', '3', 'w'], deleteWords)

// 自定义超时
onSequence(['g', 't'], handler, { timeout: 2000 })

// 条件触发
onSequence(['g', 't'], handler, {
    when: () => !isReadOnly,
})

// 自定义 cancel 键
onSequence(['g', 't'], handler, {
    cancelKey: 'q',
})
```

## 状态机

```
      ┌──────────┐
      │   Idle   │
      └────┬─────┘
           │ 按下触发键
           ▼
      ┌──────────┐
      │ Pending  │◄────────────────┐
      └────┬─────┘                 │
           │ 超时 / Cancel 键 /    │
           │ 非目标键              │
           ▼                      │
      ┌──────────┐                │
      │   Idle   │────────────────┘
      └────┬─────┘
           │ 最后一个键
           ▼
    ┌───────────┐
    │ Executing │ (同步)
    └─────┬─────┘
          │ 执行完成
          ▼
      ┌──────────┐
      │   Idle   │
      └──────────┘
```

### 状态说明

| 状态        | 说明                                 |
| ----------- | ------------------------------------ |
| `Idle`      | 初始状态，等待用户按下序列的第一个键 |
| `Pending`   | 等待后续键，超时后自动回到 Idle      |
| `Executing` | 正在执行 handler（同步）             |

## 选项

| 选项             | 类型            | 默认值     | 说明               |
| ---------------- | --------------- | ---------- | ------------------ |
| `timeout`        | `number`        | `1000`     | 序列超时（ms）     |
| `preventDefault` | `boolean`       | `true`     | 阻止浏览器默认行为 |
| `when`           | `() => boolean` | —          | 触发条件           |
| `cancelKey`      | `ShortcutKey`   | `'Escape'` | 取消序列的按键     |

## 3+ 键序列

```typescript
engine.registerSequence({
    keys: ['g', 'g'],
    handler: () => goToTop(),
})

engine.registerSequence({
    keys: ['d', '3', 'w'],
    handler: () => deleteWords(3),
})
```

## 同首键多序列

```typescript
engine.registerSequence({ id: 'gg', keys: ['g', 'g'], handler: goToTop })
engine.registerSequence({ id: 'gt', keys: ['g', 't'], handler: goToToday })
engine.registerSequence({ id: 'gl', keys: ['g', 'l'], handler: goToList })
```
