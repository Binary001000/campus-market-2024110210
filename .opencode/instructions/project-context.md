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
