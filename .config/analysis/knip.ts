import type { KnipConfig } from 'knip'

const config: KnipConfig = {
    entry: ['packages/*/src/index.ts', 'vitest.config.ts'],
    project: [
        'packages/*/src/**/*.ts',
        'packages/*/test/**/*.ts',
        '.config/**/*.ts',
        '.config/**/*.js',
    ],
    ignore: ['**/*.test.ts', '**/*.spec.ts', 'docs/**'],
    ignoreBinaries: ['lefthook', 'knip', 'tsc', 'oxfmt', 'vitepress'],
    ignoreDependencies: [
        'lefthook',
        'oxlint',
        'oxfmt',
        '@commitlint/types',
        'estree',
        'vitepress',
    ],
    paths: {
        '@keybound/core': ['packages/core/src/index.ts'],
    },
    eslint: { config: ['.config/lint/eslint.config.ts'] },
    commitlint: { config: ['.config/git/commitlint.config.js'] },
    lefthook: { config: ['.config/lefthook.yml'] },
    vitest: true,
    rules: {
        dependencies: 'error',
        devDependencies: 'warn',
        unlisted: 'error',
        exports: 'error',
        types: 'warn',
        nsExports: 'warn',
        nsTypes: 'warn',
        enumMembers: 'warn',
    },
}

export default config
