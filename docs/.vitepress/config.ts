import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'keybound',
    description: '框架无关的键盘快捷键引擎',
    lang: 'zh-CN',

    cleanUrls: true,
    lastUpdated: true,

    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/svg+xml',
                href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⌨</text></svg>",
            },
        ],
    ],

    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark',
        },
    },

    themeConfig: {
        logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⌨</text></svg>",
        siteTitle: 'keybound',

        nav: [
            { text: '指南', link: '/guide/introduction' },
            { text: 'API', link: '/api/core' },
            { text: '更新日志', link: '/changelog' },
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        { text: '介绍', link: '/guide/introduction' },
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '核心概念', link: '/guide/core-concepts' },
                        { text: '作用域', link: '/guide/scopes' },
                        { text: '序列键', link: '/guide/sequences' },
                    ],
                },
            ],
            '/api/': [
                {
                    text: 'API 参考',
                    items: [{ text: '@keybound/core', link: '/api/core' }],
                },
            ],
        },

        socialLinks: [
            {
                icon: 'github',
                // TODO: 仓库创建后替换为实际地址
                link: 'https://github.com/uroot5827-cmd/keybound',
            },
        ],

        footer: {
            message: '基于 MIT 许可证发布。',
            copyright: 'Copyright © 2026-present xun',
        },

        editLink: {
            pattern:
                'https://github.com/uroot5827-cmd/keybound/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页',
        },

        lastUpdated: {
            text: '最后更新',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'short',
            },
        },
    },
})
