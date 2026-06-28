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

## Task 3: 构建基础导航系统

### 导航更新

在 `App.vue` 中新增顶部导航栏，包含 5 个核心入口：

| 序号 | 导航项 | 目标路由 | 对应页面 |
|:----:|-------|---------|---------|
| 1 | 首页 | `/home` | HomeView |
| 2 | 列表 | `/list` | ListView |
| 3 | 发布 | `/publish` | PublishView |
| 4 | 消息 | `/message` | MessageView |
| 5 | 我的 | `/profile` | ProfileView |

### 导航样式

- **布局**：水平 Flex 布局，链接间距 16px
- **分隔**：底部边框分隔导航与内容区
- **交互**：悬停态背景色变化，当前路由高亮（蓝色加粗）

### 页面结构

```
┌──────────────────────────────────┐
│  <h1>校园轻集市</h1>              │  ← 全局标题
│  <p>种子项目</p>                  │  ← 副标题
│  ┌────────────────────────────┐  │
│  │ 首页 | 列表 | 发布 | 消息 | 我的 │  │  ← 导航栏 (新增)
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │     <RouterView />         │  │  ← 页面内容区
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 验证

执行 `vue-tsc --noEmit` 类型检查，无错误输出。

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| — | 暂无 | — | — | — |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 4

---

## 进阶任务 1: 看板页设计

### 页面内容

在 `BoardView.vue` 中实现数据看板，包含三个模块：

**① 统计卡片（4 项）**

| 指标 | 数值 | 单位 | 趋势 |
|------|:----:|------|:----:|
| 在售商品 | 326 | 件 | ↑ |
| 活跃用户 | 1,280 | 人 | ↑ |
| 今日访问 | 4,567 | 次 | ↑ |
| 成交订单 | 89 | 单 | → |

**② 商品分类分布**

| 分类 | 数量 |
|------|:----:|
| 教材教辅 | 86 |
| 电子产品 | 64 |
| 生活用品 | 58 |
| 运动户外 | 42 |
| 服饰美妆 | 39 |
| 其他 | 37 |

**③ 最新发布（5 条）**

| 商品 | 价格 | 时间 |
|------|:----:|------|
| 《数据结构》教材 9成新 | ¥25 | 10分钟前 |
| 机械键盘 Cherry 青轴 | ¥180 | 25分钟前 |
| 台灯 LED 护眼 | ¥35 | 1小时前 |
| 四级词汇书（赠笔记） | ¥15 | 2小时前 |
| iPad 保护壳 全新 | ¥28 | 3小时前 |

### 技术实现

- **TypeScript 接口**：定义 `StatItem` 类型（含 trend 枚举）
- **响应式数据**：`stats`、`categories`、`recentItems` 三个静态数据数组
- **布局**：CSS Grid — 4 列统计卡片 + 2 列详情面板
- **趋势指示**：↑ 绿色（上涨）、↓ 红色（下跌）、→ 灰色（持平）

### 验证

执行 `vue-tsc --noEmit` 类型检查，无错误输出。

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| — | 暂无 | — | — | — |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 5

---

## 进阶任务 2: 路由跳转增强

### 实现内容

实现 **列表页 → 详情页** 的完整跳转链路，通过动态路由参数 `:id` 传递商品编号。

### 修改文件

| 文件 | 变更 | 说明 |
|------|------|------|
| [src/router/index.ts](src/router/index.ts) | 路由 `/detail` → `/detail/:id` | 添加动态参数 `:id` |
| [src/views/ListView.vue](src/views/ListView.vue) | 重写 | 8 条静态商品数据 + `<RouterLink :to="\`/detail/${item.id}\`">` 跳转 |
| [src/views/DetailView.vue](src/views/DetailView.vue) | 重写 | `useRoute().params.id` 读取参数 + 商品详情展示 + 不存在兜底 |

### 跳转流程

```
列表页 /list
  │
  │  点击商品卡片
  │  <RouterLink to="/detail/3">
  ▼
详情页 /detail/3
  │
  │  useRoute() → route.params.id → "3"
  │  itemMap["3"] → 台灯 LED 护眼
  ▼
渲染详情：标题 / 分类 / 价格 / 描述 / 卖家 / 编号
```

### 边界处理

- **商品不存在**：`itemMap[id]` 为 `undefined` 时显示"商品不存在" + 返回列表链接
- **返回导航**：详情页顶部提供 `← 返回列表` 链接

### 技术要点

- Vue Router 动态路由参数 `:id`
- `useRoute()` 获取当前路由参数
- `<RouterLink>` 声明式导航
- TypeScript 类型安全的 `Record<string, ItemDetail>`

### 验证

执行 `vue-tsc --noEmit` 类型检查，无错误输出。

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| — | 暂无 | — | — | — |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 6

---

## 进阶任务 3: UI 优化（Element Plus）

### 注册 Element Plus

在 `main.ts` 中全局注册 Element Plus 2.14.2：

```ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

### 优化清单

| 文件 | 使用的 Element Plus 组件 | 说明 |
|------|------------------------|------|
| [src/main.ts](src/main.ts) | — | 注册 Element Plus |
| [src/App.vue](src/App.vue) | `<el-menu>` + `<el-menu-item>` | 水平导航栏，`router` 模式集成 Vue Router，自动高亮当前路由；新增看板入口 |
| [src/views/BoardView.vue](src/views/BoardView.vue) | `<el-row>` `<el-col>` `<el-card>` `<el-tag>` | 响应式栅格布局，卡片阴影悬浮效果，分类标签着色 |
| [src/views/ListView.vue](src/views/ListView.vue) | `<el-card>` `<el-tag>` | 商品卡片悬浮效果，分类标签颜色区分 |
| [src/views/DetailView.vue](src/views/DetailView.vue) | `<el-card>` `<el-tag>` `<el-button>` `<el-divider>` `<el-result>` | 详情卡片、分隔线、联系卖家按钮、商品不存在结果页 |

### 导航栏对比

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| 组件 | 原生 `<nav>` + `<RouterLink>` | `<el-menu mode="horizontal" router>` |
| 高亮 | 手动 CSS `router-link-active` | Element Plus 内置 `default-active` |
| 入口数 | 5 个 | 6 个（新增看板） |
| 样式 | 手写 30+ 行 CSS | Element Plus 默认主题 |
| 响应式 | 无 | el-menu 内置折叠 |

### 验证

执行 `vue-tsc --noEmit` 类型检查，无错误输出。

---

### 遇到的问题

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:----:|---------|------|---------|:----:|
| — | 暂无 | — | — | — |

---

### AI 协作记录

> 见 [AI_Collaboration_Card.md](../ai/AI_Collaboration_Card.md) — 协作记录 7

---
