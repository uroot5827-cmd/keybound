# 作用域

作用域决定了快捷键在哪些区域生效。

## 内置作用域

| 作用域     | 适用场景                           |
| ---------- | ---------------------------------- |
| `global`   | 全局快捷键，任何地方都生效         |
| `form`     | 表单内快捷键（如 Ctrl+Enter 提交） |
| `list`     | 列表导航（j/k 上下移动）           |
| `dropdown` | 下拉框选择                         |
| `edit`     | 编辑器内快捷键                     |

## 创建自定义作用域

```typescript
const engine = new KeyboardEngine()

// 创建作用域
const scope = engine.createScope('my-scope')

// 在作用域内注册
scope.register({
    id: 'my-action',
    key: 'Ctrl+M',
    handler: () => doSomething(),
})

// 设置为活跃作用域
engine.setActiveScope('my-scope')
```

## 作用域切换

```typescript
// 切换到自定义作用域
engine.setActiveScope('my-scope')

// 切换回全局作用域
engine.setActiveScope('global')
```

## 优先级：作用域 > 全局

当同一快捷键在不同作用域注册时，活跃作用域的处理器优先执行。
