## Day4 - 图片资源与代码注释

### 项目目标
校园市场二手交易平台（Vue 3 + TypeScript + Vite）

### Pexels 图片映射（db.json）
| id | 商品 | Pexels ID | URL |
|----|------|-----------|-----|
| 1 | 机械键盘 Cherry 青轴 | 18114576 | pexels-photo-18114576.jpeg |
| 2 | 高等数学教材 | 19905625 | pexels-photo-19905625.jpeg |
| 3 | LED 护眼台灯 | 8004021 | pexels-photo-8004021.jpeg |
| 4 | 考研英语真题集 | Unsplash (不变) | — |
| 5 | iPad Pro 保护壳 | Unsplash (不变) | — |
| 6 | 瑜伽垫 | 16143600 | pexels-photo-16143600.jpeg |

### 已完成
- 5 个代码 bug 修复
- 25 个源文件添加中文注释
- db.json id=1,2,3,6 图片替换为 Pexels（白底产品图风格）
- ListView.vue / DetailView.vue 添加 `referrerpolicy="no-referrer"`
- docs/ 文档更新
- vue-tsc 无类型错误

### 关键决策
- 使用 Pexels CDN 替代 Unsplash（白底产品图风格更一致）
- 图片格式：`w=400&h=300` 裁剪
- 外部图片统一加 `referrerpolicy="no-referrer"`
- 安装 opencode-mem 插件实现跨会话持久记忆

---

## Day5 - Pinia 状态管理与用户中心

### 已完成
- user.ts Store：管理当前用户（name/college/grade/avatar/bio），getters（displayName/userDescription），actions（updateProfile/login/logout）
- favorite.ts Store：管理收藏列表，actions（addFavorite/removeFavorite/toggleFavorite/isFavorite）
- AppHeader.vue：导航栏显示 userStore.displayName（条件渲染 v-if="isLoggedIn"）
- PublishView.vue：publisher 字段从 userStore.displayName 读取
- ListView.vue：二手集市卡片添加收藏/取消收藏按钮（favoriteStore）
- UserCenterView.vue：用户资料 + 我的发布（Promise.all 四类API + computed 筛选）+ 我的收藏

### Day5 Wrap-up 修复（2026-07-01）
- **Bug 修复**: LostFoundItem 接口新增 publisher 字段，修复发布失物招领时 publisher 缺失导致"我的发布"无法匹配的问题
- **window.alert → ElMessage**：PublishView 统一使用 Element Plus 消息提示
- **resetForm 重构**：提取 getInitialForm() 工厂函数，resetForm 用 Object.assign 一行重置
- **类型简化**：UserCenterView 中 Awaited<ReturnType<...>> 改为直接使用 TradeItem[] 等具体类型
- **安全守卫**：ListView 中 item.id! 非空断言替换为 item.id && 条件守卫
- **Git commits**: `8c69ad5`, `9a5294b`
