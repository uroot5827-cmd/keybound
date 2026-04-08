# @keybound/core

## KeyboardEngine

核心引擎类。

```typescript
import { KeyboardEngine } from '@keybound/core'

const engine = new KeyboardEngine()
```

### 方法

#### `register(config)`

注册一个快捷键。

```typescript
const unregister = engine.register({
    id: string
    key: ShortcutKey
    handler: (e: KeyboardEvent) => void | boolean
    priority?: number       // 默认 0
    scope?: string          // 默认 'global'
    meta?: {
        label?: string
        description?: string
        category?: string
    }
})
// 返回注销函数
```

#### `unregister(id)`

注销指定 ID 的快捷键。

```typescript
engine.unregister('save')
```

#### `dispatch(e)`

派发键盘事件，返回是否被处理。

```typescript
const handled = engine.dispatch(keyEvent: KeyboardEvent): boolean
```

#### `createScope(name)`

创建自定义作用域。

```typescript
const scope = engine.createScope('my-scope')
```

#### `setActiveScope(scope)`

设置活跃作用域。

```typescript
engine.setActiveScope('my-scope')
```

#### `getAll()`

获取所有已注册的快捷键。

```typescript
const shortcuts = engine.getAll(): ShortcutConfig[]
```

#### `getConflicts(key)`

获取指定快捷键的冲突项。

```typescript
const conflicts = engine.getConflicts(key: ShortcutKey)
```

#### `onChange(listener)`

监听注册表变更。

```typescript
const unsubscribe = engine.onChange(
    (type: 'register' | 'unregister', entry: ShortcutConfig) => void
)
```

---

## ShortcutRegistry

全局注册表（单例）。

```typescript
import { getShortcutRegistry } from '@keybound/core'

const registry = getShortcutRegistry()
```

### 方法

| 方法                 | 说明               |
| -------------------- | ------------------ |
| `register(entry)`    | 注册，返回注销函数 |
| `unregister(id)`     | 注销               |
| `getAll()`           | 获取所有           |
| `getByScope(scope)`  | 按作用域过滤       |
| `getConflicts(key)`  | 冲突检测           |
| `has(key, scope?)`   | 检查是否已注册     |
| `onChange(listener)` | 监听变更           |
| `clear()`            | 清空（测试用）     |

---

## createShortcutHandlerChain

创建处理器责任链。

```typescript
import { createShortcutHandlerChain } from '@keybound/core'

const chain = createShortcutHandlerChain()

// 添加节点
const remove = chain.addNode({
    id: string
    key: ShortcutKey
    priority: number
    handler: KeyHandler
})

// 派发
chain.dispatch(keyEvent)

// 查询
chain.getNodes()

// 清空
chain.clear()
```

---

## 类型

### ShortcutKey

品牌类型，编译时校验修饰符顺序。

```typescript
import { shortcutKey } from '@keybound/core'

const key = shortcutKey('Ctrl+Shift+S') // ✅
const bad = shortcutKey('Shift+Ctrl+S') // ❌ 运行时错误
```

### KeyHandler

快捷键处理器类型。

```typescript
type KeyHandler = (e: KeyboardEvent) => void | boolean
// 返回 false → 继续传递给下一个处理器
// 返回 void/true → 停止传播
```
