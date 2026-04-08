---
layout: home
title: keybound
titleTemplate: false

hero:
    name: keybound
    text: 框架无关的键盘快捷键引擎
    tagline: 注册表 + 责任链 + 作用域 + 序列键，为复杂 Web 应用而生
    actions:
        - theme: brand
          text: 快速开始 →
          link: /guide/getting-started
        - theme: alt
          text: API 参考
          link: /api/core

features:
    - title: 注册表模式
      details: 动态注册/注销快捷键，支持冲突检测、变更通知，让 100+ 快捷键井然有序。
    - title: 责任链调度
      details: 按优先级排序执行，handler 返回 false 继续传递给下一级，支持中断传播。
    - title: 作用域系统
      details: global / form / list / dropdown / edit 等作用域，精细控制快捷键的生效范围。
    - title: 序列键支持
      details: 2键 Chord（G→T）、3+ 键序列（gg、Goto），Linear/Vim 风格体验。
    - title: 编译时类型安全
      details: ShortcutKey 品牌类型，修饰符顺序编译校验，IDE 自动补全。
    - title: 框架无关设计
      details: 核心引擎零依赖，可搭配 Vue、React、Svelte 使用。
---
