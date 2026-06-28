# Day 2 Process Evidence

---

## Task 1: 扩展 7 大页面骨架

### 新增页面

在 `src/views/` 下新增 6 个页面组件，加上已有的 `HomeView.vue`，构成 7 大页面骨架：

| 序号 | 页面名称 | 文件名 | 路由路径（规划） | 说明 |
|:----:|---------|--------|---------------|------|
| 1 | 首页 | `HomeView.vue` | `/` | 已有，项目入口 |
| 2 | 列表页 | `ListView.vue` | `/list` | 商品/信息列表 |
| 3 | 详情页 | `DetailView.vue` | `/detail/:id` | 单个信息展示 |
| 4 | 发布页 | `PublishView.vue` | `/publish` | 发布信息 |
| 5 | 消息页 | `MessageView.vue` | `/message` | 消息中心 |
| 6 | 个人中心 | `ProfileView.vue` | `/profile` | 个人中心 |
| 7 | 看板页 | `BoardView.vue` | `/board` | 统计/概览 |

### 页面模板结构

每个页面均包含 Vue SFC 三段式结构：

- `<script setup lang="ts">` — 组件逻辑（当前为空，后续填充）
- `<template>` — 页面占位标题
- `<style scoped>` — 组件样式（当前为空，后续添加）

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| — | 暂无 | — | — | — |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 2

---

## Task 2: 完善路由系统

### 路由配置

更新 `src/router/index.ts`，新增 7 条路由，总计 8 条：

| 序号 | 路径 | 路由名称 | 视图组件 | 加载方式 |
|:----:|------|---------|---------|:--------:|
| 1 | `/` | `home` | `HomeView` | 直接导入 |
| 2 | `/home` | `Home` | `HomeView` | 直接导入 |
| 3 | `/list` | `List` | `ListView` | 懒加载 |
| 4 | `/detail` | `Detail` | `DetailView` | 懒加载 |
| 5 | `/publish` | `Publish` | `PublishView` | 懒加载 |
| 6 | `/message` | `Message` | `MessageView` | 懒加载 |
| 7 | `/profile` | `Profile` | `ProfileView` | 懒加载 |
| 8 | `/board` | `Board` | `BoardView` | 懒加载 |

### 路由设计说明

- **路由模式**：`createWebHistory`（HTML5 History，URL 无 `#`）
- **懒加载**：除 HomeView 外，其余 6 个页面均使用 `() => import()` 动态导入，按需加载，减小首屏体积
- **路由命名**：每条路由均配置 `name`，支持命名跳转
- **路由与视图一一对应**：每个路径对应一个 View 组件

### 验证

执行 `vue-tsc --noEmit` 类型检查，无错误输出。

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| 1 | `/` 和 `/home` 路由 name 冲突 | 两条路由都使用了 `name: 'home'`，Vue Router 要求路由名称唯一 | 将 `/home` 路由的 name 改为 `'Home'`（大写 H） | ✅ 已解决 |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 3

---
