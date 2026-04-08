# keybound

**框架无关的键盘快捷键引擎** — 提供注册表、作用域、责任链、序列键等完整能力。

## 特性

- **注册表模式** — 动态注册/注销、冲突检测、变更通知
- **责任链调度** — 优先级排序、中断传播
- **作用域管理** — global / form / list / dropdown / edit
- **序列键支持** — 2键 Chord、3+ 键序列（Vim 风格）
- **品牌类型** — ShortcutKey 编译时校验修饰符顺序
- **命令面板** — 内置 Cmd+K 集成
- **帮助面板** — 自动生成快捷键列表

## 安装

```bash
npm install @keybound/core
# 或
pnpm add @keybound/core
```

## 快速开始

```typescript
import { KeyboardEngine } from '@keybound/core'

const engine = new KeyboardEngine()

engine.register({
    id: 'save',
    key: 'Ctrl+S',
    handler: () => save(),
})

// 调度键盘事件
document.addEventListener('keydown', (e) => {
    engine.dispatch(e)
})
```

## 文档

- [贡献指南](./CONTRIBUTING.md)
- [更新日志](./docs/changelog.md)

## 包结构

| 包               | 说明                   |
| ---------------- | ---------------------- |
| `@keybound/core` | 框架无关的核心引擎     |
| `@keybound/vue`  | Vue 3 适配器（开发中） |

## 开发

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm check:types

# 运行测试
pnpm test

# 代码检查
pnpm check:lint
pnpm check:format

# 完整检查
pnpm check

# 构建
pnpm build
```

## 许可证

[MIT](./LICENSE)
