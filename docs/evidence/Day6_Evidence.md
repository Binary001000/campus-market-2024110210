# Day6 Evidence - 鉴权守卫与系统完善

---

## 1. 今日完成内容

Day6 的核心任务是完成项目的"收尾加固"和"视觉统一"。今日的主要工作分为两条线：一是防止非登录用户越权操作的**鉴权守卫**，二是对标电商平台的 **UI 美化**（5 阶段）。同时完成了暗黑模式移除、死代码清理、登录/用户体系完善以及全量验证。

具体工作包括：

- **越权操作守卫**：PublishView / MessageView 添加页面级登录门禁（`v-if="!userStore.isLoggedIn"`），DetailView 6 个交互 handler 和 ListView 收藏 handler 添加操作级登录守卫
- **UI 美化 Phase 1**：CSS 变量补齐（--bg-secondary、--color-primary-light-9），AppLayout 背景硬编码色 → CSS 变量，收藏图标 emoji → SVG heart path，DetailView 底部 padding 修复
- **UI 美化 Phase 2**：AppNav 全部重写（8 项自定义 SVG 图标 + hover 背景淡色 + active 底部品牌蓝指示条 + 全部硬编码色替换为 CSS 变量）
- **UI 美化 Phase 3**：LostFound / GroupBuy / Errand 三色系独立渐变 header + 类型/状态筛选 + 排序器 + 统计条（橙 #F97316 / 绿 #10B981 / 紫 #8B5CF6）
- **UI 美化 Phase 4**：PublishView 拆为 3 段 el-card（选择类型 / 基本信息 / 补充信息），每段 header 含彩色 SVG 图标
- **UI 美化 Phase 5**：创建 MobileNav.vue（≤768px 5 项底部导航 + SVG 图标 + 高亮指示条），AppLayout 集成，mobile 安全区 padding-bottom
- **暗黑模式完整移除**：`[data-theme='dark']` CSS 块删除、theme toggle 按钮删除、localStorage 相关代码删除
- **死代码删除**：FormField.vue（被原生 HTML 表单替代）、ProfileView.vue（被 UserCenterView 替代）、src/utils/theme.ts（暗黑模式不存在后不再需要），均零引用
- **登录/用户体系完善**：userStore 新增 localStorage 持久化、AppHeader 新增 el-dialog 登录/注册（用户列表选择 + 注册表单）、UserCenterView 新增登录门禁
- **最终验证**：`vue-tsc --noEmit` 零错误，`oxlint` 零警告，`vite build` 成功

---

## 2. 守卫设计说明

### 页面级守卫

未登录用户访问需要身份认证的页面时，显示门禁提示而非直接渲染内容。

| 页面 | 实现方式 | 提示内容 |
|------|---------|---------|
| PublishView.vue | `v-if="!userStore.isLoggedIn"` 门禁块 | SVG 用户图标 + "请先登录后再发布信息" + "去登录" 按钮 |
| MessageView.vue | `v-if="!userStore.isLoggedIn"` 门禁块 | SVG 用户图标 + "请先登录后再查看消息" + "去登录" 按钮 |
| UserCenterView.vue | `v-if="!userStore.isLoggedIn"` 门禁块 | 同前（Day5 已实现） |

门禁块通过 `openLogin()` 函数查找 AppHeader 中的登录按钮并触发 click，复用已有的 `el-dialog` 登录弹窗。

### 操作级守卫

用户在已进入页面的情况下，点击需要身份认证的操作按钮时进行拦截，给出警告提示而非执行操作。

| 操作 | 所在页面 | 守卫位置 | 提示 |
|------|---------|---------|------|
| 收藏 | DetailView.vue | `handleToggleFavorite()` 首行 | "请先登录后再收藏" |
| 联系卖家 | DetailView.vue | `handleContact()` 首行 | "请先登录后再联系卖家" |
| 删除 | DetailView.vue | `handleDelete()` 首行 | "请先登录后再删除" |
| 参与拼单 | DetailView.vue | `handleJoinGroupBuy()` 首行 | "请先登录后再参与拼单" |
| 接单 | DetailView.vue | `handleAcceptErrand()` 首行 | "请先登录后再接单" |
| 砍价 | DetailView.vue | `openBargain()` 首行 | "请先登录后再砍价" |
| 收藏 | ListView.vue | `handleToggleFavorite()` 首行 | "请先登录后再收藏" |

所有守卫使用 `if (!userStore.isLoggedIn)` 判断 + `ElMessage.warning()` 提示。

---

## 3. UI 美化变更清单

| Phase | 内容 | 主要涉及文件 |
|-------|------|-------------|
| Phase 1 | CSS 变量（--bg-secondary / --color-primary-light-9）补齐、AppLayout #f5f7fb → var(--bg-page)、收藏 emoji → SVG heart path 双态、DetailView margin-bottom → padding-bottom | App.vue, AppLayout.vue, ListView.vue, DetailView.vue |
| Phase 2 | AppNav 全部重写：8 项自定义 SVG 图标 + hover 背景淡色 + active 底部 2px 品牌蓝色条 + 全部硬编码色 → CSS 变量 | AppNav.vue |
| Phase 3 | LostFound(橙#F97316) / GroupBuy(绿#10B981) / Errand(紫#8B5CF6) 独立渐变 header + 类型/状态筛选 + 排序器 + 统计条 | LostFoundView.vue, GroupBuyView.vue, ErrandView.vue |
| Phase 4 | PublishView 3 段 el-card 布局（选择类型 / 基本信息 / 补充信息），每段 header 含彩色 SVG 图标 | PublishView.vue |
| Phase 5 | MobileNav.vue 创建（≤768px 5 项底部导航 + SVG 图标 + 高亮指示条 + 安全区 padding）、AppLayout 集成 | MobileNav.vue, AppLayout.vue |

### 暗黑模式移除

- 删除 `src/App.vue` 中 `[data-theme='dark']` 全部 CSS 块
- 删除所有组件中的暗黑样式覆盖（`@media (prefers-color-scheme: dark)`）
- 删除 AppHeader 中 theme toggle 按钮
- 删除 `localStorage` 主题存储相关代码
- 删除 `src/utils/theme.ts` 工具模块

### 死代码清理

| 文件 | 删除原因 |
|------|---------|
| FormField.vue | 已被原生 HTML 表单控件替代，零引用 |
| ProfileView.vue | 功能被 UserCenterView.vue 覆盖，路由已改为 /user |
| src/utils/theme.ts | 暗黑模式移除后不再需要，零引用 |

---

## 4. 登录/用户体系

| 组件 | 职责 |
|------|------|
| `src/stores/user.ts` | localStorage 持久化 + setUser/logout/login/updateProfile + isLoggedIn 计算属性 |
| `src/components/AppHeader.vue` | 头像渐变圆 + el-dialog 登录/注册（用户列表选择 + 注册表单） |
| `src/api/user.ts` | getUsers() / createUser() / getUserById() / updateUser() |
| `src/views/UserCenterView.vue` | 登录门禁 + ErrorState + 安全 id 访问 |

登录恢复后需重新调用 `loadConversations()` / `loadFavorites()` 更新 userId 关联数据。

---

## 5. AI 协作记录

### 使用的 AI 工具
opencode + Claude Code（DeepSeek v4 Pro）

### 核心 Prompt
```
1. 越权操作守卫：
   - PublishView / MessageView 页面级登录门禁（v-if="!userStore.isLoggedIn"）
   - DetailView / ListView 操作级守卫（收藏/联系/删除/拼单/接单/砍价）
2. UI 美化 Phase 1~5：
   - Phase 1: CSS 变量补齐、SVG 收藏图标、DetailView padding
   - Phase 2: AppNav 全部重写（8 项 SVG 图标 + hover 背景色 + 底部指示条）
   - Phase 3: LostFound/GroupBuy/Errand 差异化页面设计
   - Phase 4: PublishView 3 段卡片式布局
   - Phase 5: MobileNav.vue 新建 + AppLayout 集成
3. 最终 lint + type-check 验证
```

### AI 生成内容

- **守卫逻辑**：AI 为 PublishView / MessageView / DetailView / ListView 添加了登录守卫判断，并设计了 `openLogin()` 函数触发 AppHeader 登录弹窗
- **CSS 变量与全局样式**：AI 补充了缺失的 --bg-secondary / --color-primary-light-9 变量，替换了各处硬编码色
- **AppNav 重写**：AI 使用 8 项独立 SVG path 替代原有 el-icon + 文字组合，添加 hover/active 交互样式
- **三分类差异化**：AI 为 LostFound / GroupBuy / Errand 各自设计了独立的渐变背景、筛选逻辑和统计条
- **PublishView 卡片化**：AI 将表单拆为 3 段 el-card，每段 header 含彩色 SVG 图标
- **MobileNav**：AI 新建底部导航组件，5 项 SVG 图标 + 高亮指示条 + responsive 隐藏
- **用户体系**：AI 重写了 userStore（localStorage 持久化）、AppHeader 登录弹窗、UserCenterView 门禁

### AI 生成内容审查

| 审查项 | 结果 |
|-------|------|
| 守卫是否覆盖所有越权操作 | ✅ 页面级 + 操作级双重覆盖 |
| 守卫提示是否友好 | ✅ 使用 ElMessage.warning 而非静默失败 |
| UI 是否对标电商风格 | ✅ 电商卡片、渐变色、SVG 图标、hover 交互 |
| CSS 变量是否完整引用 | ✅ 所有颜色通过 CSS 变量引用 |
| 暗黑移除是否彻底 | ✅ 无残留 dark 样式或代码 |
| 类型检查是否通过 | ✅ 0 errors |
| lint 是否通过 | ✅ 0 warnings |

---

## 6. 遇到的问题与解决方法

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:--:|---------|------|---------|:--:|
| 1 | DetailView 发布失物招领时无法匹配用户，回复消息时显示 999 | lostFounds 缺少 publisher 字段，联系人写死；用户 ID 通过名称查找失败 | API 新增 publisher 字段；DetailView 改用 getUsers() 按 name 查找真实用户 ID；MessageView 添加 `?? conv.participants[0]` 安全 fallback | ✅ |
| 2 | type-check 报错 TS2304: Cannot find name 'userStore' | ListView 的 handleToggleFavorite 增加了 userStore 引用但未导入 | 添加 `import { useUserStore } from '../stores/user'` + `import { ElMessage } from 'element-plus'` + `const userStore = useUserStore()` | ✅ |
| 3 | PowerShell 执行策略阻止 pnpm 命令 | Windows 系统默认禁止 PowerShell 脚本执行 | 改用 `powershell -ExecutionPolicy Bypass -Command` 前缀运行 | ✅ |
| 4 | 非登录用户可自由操作收藏、联系卖家、发布、查看消息等越权行为 | 原有代码未做任何身份判断，所有功能对所有访客开放 | PublishView/MessageView 添加页面级门禁，DetailView 6 个 handler 和 ListView 收藏添加操作级守卫 | ✅ |
| 5 | PublishView Date 类型与 JSON Server 不兼容 | el-date-picker 绑定 Date 对象，JSON Server 需要 string 类型 | 提交前调用 `formatDate()` 将 Date 转为 `YYYY-MM-DD HH:mm:ss` 字符串 | ✅ |

---

## 7. 今日反思

鉴权守卫和 UI 美化是项目收尾阶段最重要的两个维度。

"越权操作"在开发初期是最容易被忽略的问题。当团队专注于功能实现时，往往会假设所有用户都处于已登录状态。但真实场景下的用户行为远比这复杂——用户可能直接收藏链接访问详情页、在未登录的情况下点击收藏按钮、或者未经授权直接删除他人的发布。这次实现的"页面级 + 操作级"双重守卫体系，分别处理了"不该进入"和"不该操作"两种场景。页面级守卫针对 Publish 和 Message 这类"无身份无意义"的页面直接阻断，操作级守卫则对 Detail 和 List 这类"可浏览但不可操作"的页面内的关键交互进行拦截。两种守卫的粒度不同，但目标一致——在用户尚未登录时给出清晰友好的引导，而不是让操作静默失败或产生误导性结果。

UI 美化 5 个阶段的迭代也体现了"渐进式重构"的思路：从变量层面的基础统一（Phase 1 的 CSS 变量），到骨架层面的视觉升级（Phase 2 的导航重写），再到分类页面的个性化（Phase 3 的三色系差异化），最后是发布表单的卡片化（Phase 4）和移动端的响应式覆盖（Phase 5）。这 5 个阶段互相独立又层层递进，每一步改动的范围可控、回归验证成本低。同时，暗黑模式移除和死代码清理作为辅助任务，确保了代码基的整洁性——遗留的暗黑样式和未使用的文件虽然不影响主功能，但会在后续维护中造成混淆。

最终 `vue-tsc --noEmit` 零错误、`oxlint` 零警告、`vite build` 成功，项目已具备完整的 Day7 展示条件。从 Day1 的空白骨架走到今天，经历了从静态展示到数据驱动、从单类型到多类型、从只读到可写、从零守卫到完整鉴权的完整演进。这个过程的每一步都在为"更好的用户体验"和"更稳定的系统结构"这两个目标服务。

---

**填写日期**：2026-07-02
