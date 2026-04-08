/** @type {import('@commitlint/types').UserConfig} */
export default {
    extends: ['@commitlint/config-conventional'],

    rules: {
        // ===== Type 规范 =====
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新功能
                'fix', // Bug 修复
                'refactor', // 重构（功能不变）
                'style', // 代码格式
                'docs', // 文档更新
                'test', // 测试相关
                'chore', // 杂项/构建/工具
                'perf', // 性能优化
                'revert', // 回滚
                'ci', // CI/CD 配置
                'build', // 构建系统
                'release', // 版本发布
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],

        // ===== Scope 规范 =====
        'scope-enum': [
            2,
            'always',
            [
                // === 包 ===
                'core', // 核心引擎
                'vue', // Vue 适配器
                'react', // React 适配器
                'svelte', // Svelte 适配器

                // === 架构模块 ===
                'registry', // 注册表
                'chain', // 责任链
                'sequence', // 序列键
                'chord', // Chord
                'scope', // 作用域
                'context', // When 条件上下文
                'engine', // Engine 引擎

                // === 功能特性 ===
                'shortcut', // 快捷键
                'command-palette', // 命令面板
                'help-panel', // 帮助面板
                'conflict', // 冲突检测

                // === 工程化 ===
                'deps', // 依赖更新
                'ci', // CI/CD
                'config', // 配置文件
                'eslint', // ESLint 配置
                'test', // 测试
                'release', // 版本发布
            ],
        ],
        'scope-empty': [0],
        'scope-case': [2, 'always', 'lower-case'],
        'scope-max-length': [0],

        // ===== Subject 规范 =====
        'header-max-length': [2, 'always', 100],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'subject-case': [2, 'always', 'lower-case'],

        // ===== Body & Footer =====
        'body-max-line-length': [2, 'always', 100],
        'footer-max-line-length': [2, 'always', 100],
        'body-empty': [0],
        'footer-empty': [0],

        // ===== 其他 =====
        'trailer-exists': [2, 'never', 'Co-Authored-By:'],
        'references-empty': [0],
    },

    ignores: [
        (commit) => commit.startsWith('Merge '),
        (commit) => commit.startsWith('Revert "'),
        (commit) => /^chore\(release\):/i.test(commit),
        (commit) => /^v?\d+\.\d+\.\d+/.test(commit),
    ],

    helpUrl: 'https://www.conventionalcommits.org/zh-hans/v1.0.0/',
}
