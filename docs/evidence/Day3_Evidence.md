# Day3 Evidence - Mock 数据建模与列表渲染

---

## 1. 今日完成内容

Day3 的核心任务是将项目从"静态页面骨架"推进到"数据驱动页面"阶段。今日完成了 **Mock 数据**建模、**JSON Server** 接口模拟、Axios 请求封装以及四个核心业务页面的**列表渲染**。

具体工作包括：

- 安装 JSON Server 0.17.4 和 Axios 1.18.1
- 在项目根目录创建 `db.json`，设计四类业务数据集合（trades/lostFounds/groupBuys/errands），共计 21 条数据
- 配置 `mock` 启动脚本，JSON Server 运行在 localhost:3001
- 创建 `src/api/http.ts` Axios 实例
- 创建四个业务 API 模块（trade.ts / lostFound.ts / groupBuy.ts / errand.ts），每个模块导出 TypeScript 接口和请求函数
- 创建通用组件 `ItemCard.vue`（卡片）和 `EmptyState.vue`（空状态）
- 改造 TradeView / LostFoundView / GroupBuyView / ErrandView 四个页面，从静态内容转为 API 数据驱动渲染

---

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---------|---------|---------|---------|
| trades | 二手交易 | id, title, category, price, condition, location, publisher, publishTime, status, description | 展示二手商品列表 |
| lostFounds | 失物招领 | id, title, type(lost/found), itemName, location, eventTime, contact, status, description | 展示失物和招领信息 |
| groupBuys | 拼单搭子 | id, title, type, targetCount, currentCount, deadline, location, publisher, status, description | 展示拼单和搭子信息 |
| errands | 跑腿委托 | id, title, taskType, reward, from, to, deadline, publisher, status, description | 展示跑腿任务列表 |

每类数据至少 5 条，共计 21 条。数据内容贴近校园生活场景（教材交易、校园卡丢失、火锅拼单、代取快递等）。

---

## 3. 我的设计

### 为什么这样设计数据字段

**二手交易（trades）**需要 `price` 和 `condition`，因为二手商品的核心决策因素是价格和成色——买家需要知道"多少钱"和"几成新"来决定是否购买。

**失物招领（lostFounds）**需要 `type` 字段区分 "lost"（丢失）和 "found"（拾获）。这两类的展示逻辑完全不同：丢失物品需要突出地点和时间方便寻找，拾获物品需要突出存放位置方便认领。

**拼单搭子（groupBuys）**需要 `targetCount` 和 `currentCount`，因为拼单的核心是"还差几个人"——通过当前人数/目标人数的对比，用户可以快速判断是否值得加入。

**跑腿委托（errands）**需要 `from`、`to` 和 `reward`，因为跑腿的核心是"从哪里到哪里、给多少酬劳"。`from` 和 `to` 清晰定义了任务路径，`reward` 是承接方最关心的信息。

### 数据与官方的差异

官方 `day3.txt` 建议使用四个独立集合（trades/lostFounds/groupBuys/errands），这与《需求分析》中统一 `items` + `type` 字段的方案不同。当前遵循 Day3 规范使用独立集合，后续如需统一模型可在 Day4-5 调整。

---

## 4. AI 设计

### AI 生成内容

- **db.json**：AI 根据校园场景提示词生成了 21 条示例数据，涵盖教材、电子产品、校园卡、雨伞、火锅拼单、考研搭子、取快递等场景
- **API 模块**：AI 按 day3.txt 示例代码生成了 trade.ts / lostFound.ts / groupBuy.ts / errand.ts 四个文件，TypeScript 接口字段与 db.json 完全对应
- **通用组件**：AI 按 day3.txt 示例代码生成了 ItemCard.vue（Props + 插槽）和 EmptyState.vue
- **页面改造**：AI 将四个业务页面从静态硬编码数据改为 `onMounted` 中调用 API + `ref` + `v-for` 渲染

### AI 设计优点

- 接口字段与 db.json 一一对应，不会出现字段不匹配
- API 层与页面层分离，后续修改接口地址只需改 http.ts
- ItemCard 组件通过插槽实现差异化底部内容，四个页面无需重复写卡片结构

### AI 设计不足之处

- 数据内容偏向二手交易场景，失物招领和跑腿委托的学校特色不够鲜明——已人工补充修改
- 未考虑加载中状态和请求失败状态（Day3 不要求，后续 Day4-5 补充）

---

## 5. 最终调整

| 调整项 | 原因 | 操作 |
|-------|------|------|
| JSON Server 版本 | AI 初次安装了 1.0.0-beta.15，项目指定 0.17.4 | 切换为 `json-server@0.17.4` |
| 数据内容补充 | AI 生成的二手数据较多，失物/拼单/跑腿偏少 | 每类补充到至少 5 条，确保校园场景覆盖 |
| 空状态组件 | day3.txt 要求创建 EmptyState.vue | 按模板实现，四个页面统一使用 |
| four pages layout | AI 生成的页面布局不一致 | 统一为 page-header + 2列Grid + ItemCard 结构 |

---

## 6. 遇到的问题与解决方法

| 序号 | 问题描述 | 原因 | 解决方案 | 状态 |
|:--:|---------|------|---------|:--:|
| 1 | JSON Server 启动命令与版本不兼容 | 初次安装的是 1.0.0-beta.15，`--watch` 参数行为不同 | 切换为项目指定版本 `json-server@0.17.4`，启动命令保持不变 | ✅ |
| 2 | 浏览器访问 localhost:3001 显示连接拒绝 | JSON Server 未启动（只在测试时临时运行） | 需要单独终端执行 `pnpm mock` 保持运行 | ✅ |
| 3 | 页面改造后原 Element Plus 样式丢失 | App.vue 已改为 `<AppLayout />`，之前的全局样式被移除 | 新页面的样式在各自 `<style scoped>` 中独立维护，不受影响 | ✅ |

---

## 7. 今日反思

Mock 数据建模、JSON Server 接口模拟和列表渲染是前端项目从"静态展示"走向"数据驱动"的关键一步。

在接触 JSON Server 之前，页面数据只能硬编码在 Vue 组件中——每改一次数据就要改一次代码。引入 Mock API 后，数据由独立的 `db.json` 管理，前端通过 Axios 请求获取，页面只负责渲染。这种"数据与视图分离"的模式是前后端分离开发的基础。

JSON Server 的价值不仅在于"模拟数据"，更在于让学生在不学习真实后端框架的前提下，提前理解 HTTP 请求、RESTful API、CRUD 操作、接口路径设计等概念。这些概念在后续对接真实后端（如 Spring Boot、FastAPI）时会直接复用。

列表渲染是最常见的页面需求。通过今天的实践，四个业务页面统一采用了相同的模式：`onMounted 请求 API → ref 存储数据 → v-for 渲染列表 → EmptyState 处理空数据`。这种模式在 Day4 的发布、Day5 的收藏和消息、Day6 的看板中会继续复用和扩展。

---

**填写日期**：2026-06-29
