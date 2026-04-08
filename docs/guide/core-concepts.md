# 核心概念

## ShortcutRegistry（注册表）

全局单例注册表，管理所有快捷键的生命周期。

```typescript
import { getShortcutRegistry } from '@keybound/core'

const registry = getShortcutRegistry()

// 注册
const unregister = registry.register({
    id: 'my-shortcut',
    key: 'Ctrl+K',
    label: '打开命令面板',
    scope: 'global',
    priority: 0,
    handler: () => openCommandPalette(),
})

// 查询
registry.getAll() // 获取所有
registry.getByScope('form') // 按作用域过滤
registry.getConflicts(key) // 冲突检测

// 注销
unregister()
```

## HandlerChain（责任链）

按优先级调度的处理器链。

```typescript
import { createShortcutHandlerChain } from '@keybound/core'

const chain = createShortcutHandlerChain()

// 添加节点（返回移除函数）
const remove = chain.addNode({
    id: 'node-1',
    key: 'Ctrl+S',
    priority: 10,
    handler: (e) => {
        save()
        // 返回 void/true → 停止链
        // 返回 false → 继续传递给下一节点
    },
})

// 派发事件
chain.dispatch(keyEvent) // 返回 boolean 表示是否被处理
```

## 调度流程

```
KeyboardEvent
    ↓
buildKeyString(e)  // 转换为 "Ctrl+S" 格式
    ↓
HandlerChain.dispatch()  // 按优先级遍历匹配节点
    ↓
Handler 返回值
    ├── true/void  → 停止传播
    └── false      → 传递给下一个节点
```

## 优先级

- 默认优先级为 `0`
- 高优先级节点先执行
- 高优先级节点消费事件后，低优先级不执行
