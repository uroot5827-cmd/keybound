# 序列键

序列键允许用户按顺序输入多个按键来触发动作，常见于 Vim 和 Linear 的操作体验。

## Chord（两键序列）

两键快速连续按下（通常 1 秒内）。

```typescript
const engine = new KeyboardEngine()

engine.registerChord({
    id: 'goto-top',
    pattern: ['g', 't'], // G → T
    timeout: 1000, // 1 秒超时
    handler: () => scrollToTop(),
})
```

## 序列键（3+ 键）

Vim 风格的多键序列。

```typescript
engine.registerSequence({
    id: 'goto-line',
    pattern: ['g', 'g'], // gg → 跳转到顶部
    timeout: 1000,
    handler: () => goToTop(),
})

engine.registerSequence({
    id: 'delete-words',
    pattern: ['d', '3', 'w'], // d3w → 删除 3 个单词
    timeout: 1000,
    handler: () => deleteWords(3),
})
```

## 状态流转

```
      ┌──────────┐
      │   Idle   │
      └────┬─────┘
           │ 按下第一键
           ▼
      ┌──────────┐
      │ Pending  │◄─────────────────┐
      └────┬─────┘                   │
           │ 超时或按键不匹配          │
           ▼                         │
      ┌──────────┐                   │
      │   Idle   │───────────────────┘
      └────┬─────┘
           │ 按下最后一键
           ▼
    ┌───────────┐
    │ Executing │
    └─────┬─────┘
          │ 执行完成
          ▼
      ┌──────────┐
      │   Idle   │
      └──────────┘
```

## 超时机制

```typescript
// 自定义超时（默认 1000ms）
engine.registerSequence({
    pattern: ['g', 'g'],
    timeout: 2000, // 2 秒内输入有效
    handler: () => goToTop(),
})
```
