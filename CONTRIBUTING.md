# 贡献指南

感谢你的兴趣！以下是参与 keybound 开发的指南。

## 开发环境

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm check:types

# 运行测试
pnpm test:run

# 代码格式检查
pnpm check:lint
pnpm check:format

# 完整检查
pnpm check
```

## 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>
```

### Type 类型

| type     | 说明                   |
| -------- | ---------------------- |
| feat     | 新功能                 |
| fix      | Bug 修复               |
| refactor | 重构（功能不变）       |
| style    | 代码格式（不影响功能） |
| docs     | 文档更新               |
| test     | 测试相关               |
| chore    | 杂项/构建/工具         |
| perf     | 性能优化               |
| build    | 构建系统               |
| ci       | CI/CD 配置             |

### 示例

```
feat(core): 添加 ShortcutRegistry 注册表

实现了全局快捷键注册表，支持按作用域分组、
动态注册/注销、冲突检测和变更通知。

Closes #12
```

## 包结构

```
packages/
└── core/          # 框架无关的核心引擎
    ├── src/       # 源码
    └── test/      # 单元测试
```

## 测试

```bash
# 运行所有测试
pnpm test

# 监听模式（开发时）
pnpm test

# 生成覆盖率报告
pnpm test:run --coverage
```

## 命名规范

- **变量/函数**: camelCase
- **类型/接口**: PascalCase
- **枚举成员**: UPPER_CASE
- **常量**: UPPER_CASE 或 camelCase（根据作用域）

## 代码审查

提交前请确保：

- [ ] `pnpm check` 通过
- [ ] 新功能有对应的测试
- [ ] 更新了相关文档
