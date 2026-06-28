# Day2 Evidence - 页面骨架与路由导航

---

## 1. 今日完成内容

Day2 的核心任务是搭建"校园轻集市"PC 端 Web App 的**页面骨架**、完成**路由导航**配置，并设计**公共布局**组件。今日不要求实现复杂业务逻辑或接入真实数据，重点在于建立清晰的页面结构、路由关系和组件边界。

本日完成以下工作：

- 在 `src/views/` 下创建了 8 个页面组件（首页、二手交易、失物招领、拼单搭子、跑腿委托、发布、消息、个人中心）
- 在 `src/components/` 下创建了 3 个公共布局组件（AppLayout、AppHeader、AppNav）
- 配置了 `src/router/index.ts`，所有路由均包含 `meta.title`
- 修改 `App.vue` 使用统一布局组件 `<AppLayout />`
- 所有页面通过导航可正常访问跳转

---

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 文件位置 |
|---------|---------|---------|
| 首页 | `/` | `src/views/HomeView.vue` |
| 二手集市 | `/list` | `src/views/ListView.vue` |
| 失物招领 | `/lost-found` | `src/views/LostFoundView.vue` |
| 拼单搭子 | `/group-buy` | `src/views/GroupBuyView.vue` |
| 跑腿委托 | `/errand` | `src/views/ErrandView.vue` |
| 发布信息 | `/publish` | `src/views/PublishView.vue` |
| 消息中心 | `/message` | `src/views/MessageView.vue` |
| 个人中心 | `/user` | `src/views/UserCenterView.vue` |

### 公共布局组件

| 组件名 | 文件位置 | 职责 |
|-------|---------|------|
| AppLayout | `src/components/AppLayout.vue` | 整体页面布局（Header + 内容区） |
| AppHeader | `src/components/AppHeader.vue` | 顶部区域（Logo + 导航） |
| AppNav | `src/components/AppNav.vue` | 导航菜单（首页/二手集市/失物招领/拼单搭子/跑腿委托/发布/消息/我的共8项） |

### 路由配置要点

- 使用 `createWebHistory` 模式（HTML5 History，URL 无 `#`）
- 每条路由配置了 `meta.title`，为后续页面标题更新和导航高亮预留扩展点
- 导航栏最终结构：首页 | 二手集市 | 失物招领 | 拼单搭子 | 跑腿委托 | 发布 | 消息 | 我的
- 路由路径保持语义化（如 `/list`、`/lost-found`、`/group-buy`、`/errand`）
- 页面组件使用懒加载 `() => import()`，减小首屏体积

---

## 3. AI 协作记录

### 使用的 AI 工具
Claude Code（DeepSeek v4 Pro）

### 核心 Prompt
```
我正在开发一个名为"校园轻集市"的 PC 端 Vue3 Web App。
技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia。

请帮我完成 Day2 的页面骨架与路由导航任务：
1. 创建首页、二手交易、失物招领、拼单搭子、跑腿委托、发布、消息、个人中心等页面；
2. 配置 Vue Router 路由；
3. 创建公共布局组件，包括顶部导航、页面容器和内容区域；
4. 页面暂时只需要基础结构，不需要真实业务数据；
5. 代码应保持简洁，适合教学实训项目继续扩展。
```

### AI 生成内容
- 页面文件：TradeView、LostFoundView、GroupBuyView、ErrandView、UserCenterView（简洁骨架）
- 公共组件：AppLayout、AppHeader、AppNav（按规范示例实现）
- 路由配置：8 条路由 + meta.title
- App.vue 改为使用 AppLayout

### 人工审查与修改
| 审查项 | 结果 |
|-------|------|
| 页面是否完整 | ✅ 包含 8 个核心页面 |
| 路由是否正确 | ✅ 路径、组件、名称一一对应 |
| 组件是否合理 | ✅ 页面组件与公共组件已分离 |
| 代码是否简洁 | ✅ 仅包含 template + script setup + 基础样式 |
| 项目是否可运行 | ✅ vue-tsc 类型检查通过 |
| 业务是否贴合 | ✅ 围绕校园二手/失物/拼单/跑腿场景 |

---

## 4. 遇到的问题与解决方法

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:--:|---------|------|---------|:--:|
| 1 | 早期实现的路由 `/` 和 `/home` 存在 name 冲突 | 两条路由都使用了 `name: 'home'`，Vue Router 要求唯一 | 修正路由 name，最终按规范只保留 `/` 一条首页路由 | ✅ |
| 2 | 初期页面内容过于复杂 | AI 生成了包含 Element Plus 组件、静态业务数据、动画等代码，超出 Day2 简洁骨架要求 | 对照官方 day2 规范，将新增的分类页面（TradeView 等）改为极简骨架：仅 `<h1>` + `<p>` 说明文字 | ✅ |
| 3 | 公共组件未拆分 | 早期导航栏、布局全部内嵌在 App.vue 中，不符合"页面组件与通用组件分离"的要求 | 按规范拆分为 AppLayout / AppHeader / AppNav 三个独立组件，App.vue 仅一行 `<AppLayout />` | ✅ |
| 4 | 路由缺少 meta.title | 初期路由配置未添加 meta 字段 | 为所有路由添加 `meta: { title: '...' }` | ✅ |
| 5 | 首页入口卡片无法跳转到分类页 | 四类入口 RouterLink 全部指向 `/list` | 为每个入口配置独立路由（二手集市的卡片跳 `/list`，其余各分类跳对应路由） | ✅ |
| 6 | 原有商品列表和详情页丢失 | 规范合规修改时移除了 `/list` 和 `/detail/:id` 路由 | 补回两条路由，同时保留新增的分类页面 | ✅ |
| 7 | 导航栏出现"集市"和"二手交易"两个相近入口 | 早期设计将统一列表和二手分类分开 | 合并为"二手集市"单一入口 → `/list`，删除 `/trade` 路由 | ✅ |

---

## 5. 今日反思

页面骨架、路由导航和公共布局对后续开发的作用：

**页面骨架**为项目提供了清晰的文件边界——每个业务场景对应一个独立页面文件，后续开发时可以直接定位到目标文件进行功能填充。如果没有统一的页面骨架，随着功能增加，文件会变得混乱，出现"想改列表页不知道去哪个文件改"的问题。

**路由导航**决定了用户如何在页面之间流转。良好的路由设计（语义化路径、命名路由、meta 扩展）不仅让 URL 可读，也为后续的路由守卫、页面标题动态更新、权限控制等提供了基础设施。如果在 Day2 路由混乱，后续添加新页面时会越来越难以维护。

**公共布局**将页面的"框架"与"内容"分离——AppLayout 负责整体结构，AppHeader 负责顶部，AppNav 负责导航。当需要修改导航菜单（如新增一个入口）时，只需修改 AppNav.vue 一个文件，所有页面自动生效。这种"修改一处、全局更新"的能力，是组件化开发的核心价值。

三者共同构成了前端项目的"骨架系统"——骨架稳固，后续填肉才有效率；骨架混乱，后续每一步都会付出额外代价。

---

**填写日期**：2026-06-28
