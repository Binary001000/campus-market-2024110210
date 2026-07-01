# Day5 Evidence - 状态管理与用户中心

---

## 1. 今日完成内容

Day5 的核心任务是引入 **Pinia** 进行前端**状态管理**，并完善**用户中心**页面。今日创建了两个 Store、将 Store 集成到多个页面、重写了个人中心。

具体工作包括：

- 创建 `user.ts` Store：管理当前用户信息（姓名/学院/年级/头像/简介）
- 创建 `favorite.ts` Store：管理收藏状态（添加/取消/切换/判断已收藏）
- AppHeader 导航栏从 Store 读取用户名称，替换硬编码文字
- PublishView 发布页的 publisher 字段从 Store 读取
- ListView 二手集市添加收藏/取消收藏按钮
- UserCenterView 个人中心重写：用户资料 + 我的发布 + 我的收藏

---

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|-----------|---------|---------|---------|
| src/stores/user.ts | 当前用户信息 | isLoggedIn, currentUser | updateProfile, login, logout |
| src/stores/favorite.ts | 收藏状态 | favorites | addFavorite, removeFavorite, toggleFavorite, isFavorite |

### user.ts 设计

- **State**：`isLoggedIn`（登录标志）+ `currentUser`（id/name/college/grade/avatar/bio）
- **Getters**：`displayName`（返回 name）、`userDescription`（返回 "学院 · 年级"）
- **Actions**：`updateProfile()`（合并更新）、`logout()` / `login()`（切换登录状态）
- 当前使用模拟用户："校园用户" / "计算机学院" / "2023 级"

### favorite.ts 设计

- **State**：`favorites` 数组，元素含 id/type/title/description/location
- **Getters**：`favoriteCount`（收藏总数）
- **Actions**：`addFavorite()`（防重复添加）、`removeFavorite()`、`toggleFavorite()`（自动判断添加/移除）、`isFavorite()`（判断是否已收藏）
- type 支持四类：'trade' | 'lostFound' | 'groupBuy' | 'errand'
- 数据仅存前端内存，刷新后丢失（Day5 可接受）

---

## 3. 状态边界说明

| 数据类型 | 是否放入 Store | 原因 |
|---------|:--:|------|
| 当前用户信息 | ✅ | 导航栏、发布页、个人中心等多处使用 |
| 收藏列表 | ✅ | 列表页和个人中心都需要读取和修改 |
| 表单输入内容 | ❌ | 仅属于 PublishView 页面，无跨页面共享需求 |
| 表单校验错误 | ❌ | 仅属于当前表单，不应污染全局状态 |
| 接口列表数据 | ❌ | 各页面独立获取，未通过 Store 共享 |
| 页面筛选条件 | ❌ | 仅属于当前页面，不需要跨页面保持 |

### 设计原则

Store 只存放"多个页面或组件需要共享"的状态，而不是存放所有数据的地方。如果一个状态只被单个页面使用，放在该页面组件的 `ref`/`reactive` 中即可。

---

## 4. 页面使用记录

| 页面/组件 | 使用的 Store | 用途 |
|----------|------------|------|
| AppHeader.vue | userStore | 导航栏右侧显示当前用户名称 |
| PublishView.vue | userStore | publisher 字段使用 userStore.displayName |
| ListView.vue | favoriteStore | 每张卡片添加收藏/取消收藏按钮 |
| UserCenterView.vue | userStore + favoriteStore | 用户资料展示 + 我的发布列表 + 我的收藏列表 |

### 我的发布实现

UserCenterView 在 onMounted 中通过 `Promise.all` 同时请求四类数据（trades/lostFounds/groupBuys/errands），然后通过 `computed` 按 `publisher === userStore.displayName` 筛选出当前用户的发布记录，统一展示在列表中。

---

## 5. AI 协作记录

### 使用的 AI 工具
Claude Code（DeepSeek v4 Pro）

### AI 生成内容
- **user.ts**：AI 按 day5.txt 示例生成了用户 Store，使用 Options API 风格
- **favorite.ts**：AI 按示例生成了收藏 Store，toggleFavorite 自动判断逻辑
- **跨页面集成**：AI 更新了 AppHeader/PublishView/ListView/UserCenterView 四个文件
- **我的发布**：AI 实现了 Promise.all 并行请求 + computed 筛选的方案

### AI 生成内容审查
| 审查项 | 结果 |
|-------|------|
| Store 划分是否合理 | ✅ 用户和收藏独立分开 |
| 状态是否必要 | ✅ 仅跨页面共享的状态放入 Store |
| 命名是否清晰 | ✅ displayName/userDescription/favoriteCount 语义明确 |
| 代码是否简洁 | ✅ 无 JWT/权限/登录注册 |

---

## 6. 人工调整内容

| 调整项 | 原因 | 操作 |
|-------|------|------|
| 添加我的发布功能 | day5 规范允许进阶实现 | 增加 Promise.all 四类数据请求 + computed 筛选 |
| ~~lostFound 用 contact~~ → 改为 publisher | LostFoundItem 原本无 publisher 字段，且创建时 contact 写死为"站内消息联系"，导致筛选永远无法匹配当前用户 | 接口新增 publisher 字段，创建时传入 `userStore.displayName`，筛选用 `l.publisher` |
| 保留标签切换结构 | 发布和收藏内容不同，需分区展示 | activeTab 切换"我的发布"/"我的收藏" |
| 收藏数据不持久化 | Day5 可接受刷新丢失 | 暂未添加 localStorage |
| AppHeader 增加登录判断 | 直接显示 userStore.displayName 未考虑未登录状态 | 用 `v-if="userStore.isLoggedIn"` 条件渲染 |
| ListView 收藏按钮安全性 | `item.id!` 非空断言存在风险 | 增加 `item.id &&` 守卫 |
| PublishView 替换 window.alert | 项目中已引入 Element Plus，应统一使用 ElMessage | 全部替换为 ElMessage.success/error |
| PublishView resetForm 优化 | 逐字段手动重置，维护困难 | 提取 getInitialForm 工厂函数，resetForm 用 Object.assign 重置 |

---

## 7. 测试记录

| 测试序号 | 操作 | 预期结果 | 状态 |
|:--:|------|---------|:--:|
| 1 | 导航栏查看用户名 | 显示"校园用户"（来自 userStore）；未登录时显示"未登录" | ✅ |
| 2 | 发布一条二手商品 | publisher 为"校园用户"而非"当前用户" | ✅ |
| 3 | 在二手集市点击"收藏" | 按钮变为"❤️ 已收藏" | ✅ |
| 4 | 进入个人中心 → 我的收藏 | 看到刚收藏的商品 | ✅ |
| 5 | 点击"取消收藏" | 该商品从收藏列表消失 | ✅ |
| 6 | 进入个人中心 → 我的发布 | 看到当前用户发布的商品（按 publisher 筛选） | ✅ |
| 7 | 发布失物招领信息 | publisher 正确传入，在"我的发布"中可见 | ✅ |
| 8 | 发布成功后弹窗 | 使用 ElMessage 提示而非 window.alert | ✅ |

> 已通过 vue-tsc 类型检查、oxlint 代码检查以及代码审查验证。

---

## 8. 遇到的问题与解决方法

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:--:|---------|------|---------|:--:|
| 1 | 收藏点击后刷新页面数据丢失 | Pinia 内存状态，刷新后自动重置 | 符合 Day5 预期，后续可加 localStorage | ✅ |
| 2 | 我的发布中 lostFound 永远无法匹配当前用户 | LostFoundItem 无 publisher 字段，contact 写死为"站内消息联系" | 接口新增 publisher 字段，发布时传入用户名称，筛选改用 `l.publisher` | ✅ |
| 3 | 新建 user.ts 文件未成功写入 | 并行 Write 时遗漏了 user.ts | 补充创建 user.ts | ✅ |
| 4 | PublishView 使用 window.alert 与项目风格不一致 | 项目已引入 Element Plus | 全部替换为 ElMessage.success/error | ✅ |
| 5 | ListView 中 item.id! 非空断言存在风险 | id 类型为 `number \| undefined` | 增加 `item.id &&` 守卫后再操作 | ✅ |

---

## 9. 今日反思

Pinia 状态管理对多页面前端应用的作用，可以从一个简单的问题来理解：**"一条数据变化了，哪些页面需要知道？"**

如果在 Day2-Day4 的阶段，这个问题的答案是"不需要——每个页面各自管理自己的数据"。但到了 Day5，情况变了：导航栏需要知道当前用户是谁，发布页需要知道发布人是谁，个人中心需要知道用户收藏了什么。如果这些信息仍然分散在各个页面组件中，就会出现"同一个用户名称在五个地方写了五遍"的情况，改一处漏一处。

Pinia 的作用就是把这种"多个页面都关心的数据"抽出来，放在一个统一的地方管理。导航栏从 Store 读、发布页从 Store 读、个人中心也从 Store 读——数据源一致，修改一处，所有地方同步更新。

"用户中心"不是孤立的页面，它是 Store 状态的展示窗口。用户在列表页收藏了一个商品，这个操作修改了 favoriteStore，个人中心立即能看到变化——不需要传 props、不需要事件总线、不需要手动刷新。这种"修改即同步"的能力，是状态管理给多页面应用带来的核心价值。

当然，状态管理也有"边界"问题。不是所有数据都适合放进 Store。表单的临时输入、页面的筛选条件、一次性的 API 响应——这些数据只属于当前页面，放进 Store 反而会增加耦合。分清楚"什么该放、什么不该放"，是理解状态管理的关键一步。

### 收尾阶段发现的教训

在 Day5 收尾审查中，发现了一个典型的"接口与页面不匹配" Bug：`LostFoundItem` 接口没有 `publisher` 字段，发布时 `contact` 写死为固定值，但个人中心却用 `contact` 去匹配当前用户名——这条记录永远不可能出现在"我的发布"中。这个问题的根源是 Day5 引入 Store 后，`UserCenterView` 需要按 `publisher` 筛选所有类型的数据，但 `LostFoundItem` 却没有跟上这个变化。这提醒我们：当状态管理引入新的查询维度（如"按当前用户筛选"）时，必须确保所有相关数据模型都支持该维度，否则就会出现"逻辑写了但数据对不上"的隐蔽 Bug。

---

**填写日期**：2026-06-29
