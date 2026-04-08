# 快速开始

## 安装

```bash
npm install @keybound/core
# 或
pnpm add @keybound/core
```

## 基础用法

```typescript
import { KeyboardEngine } from '@keybound/core'

// 创建引擎实例
const engine = new KeyboardEngine()

// 注册快捷键
const unregister = engine.register({
    id: 'save',
    key: 'Ctrl+S',
    handler: () => save(),
})

// 调度键盘事件
document.addEventListener('keydown', (e) => {
    engine.dispatch(e)
})

// 注销
unregister()
```

## 完整示例

```typescript
import { KeyboardEngine } from '@keybound/core'

const engine = new KeyboardEngine()

// 注册多个快捷键
engine.register({
    id: 'save',
    key: 'Ctrl+S',
    scope: 'global',
    priority: 10,
    handler: (e) => {
        save()
    },
})

engine.register({
    id: 'undo',
    key: 'Ctrl+Z',
    handler: () => undo(),
})

// 监听变更
engine.onChange((type, entry) => {
    console.log(`${type}: ${entry.id}`)
})
```

## 下一步

- [核心概念](/guide/core-concepts) — 了解 Registry、Chain、Scope 的设计
- [API 参考](/api/core) — 查看完整的 API 文档
