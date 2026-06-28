<script setup lang="ts">
interface StatItem {
  label: string
  value: number | string
  unit: string
  trend: 'up' | 'down' | 'flat'
}

const stats: StatItem[] = [
  { label: '在售商品', value: 326, unit: '件', trend: 'up' },
  { label: '活跃用户', value: 1280, unit: '人', trend: 'up' },
  { label: '今日访问', value: 4567, unit: '次', trend: 'up' },
  { label: '成交订单', value: 89, unit: '单', trend: 'flat' },
]

const categories = [
  { name: '教材教辅', count: 86, color: '#1890ff' },
  { name: '电子产品', count: 64, color: '#52c41a' },
  { name: '生活用品', count: 58, color: '#faad14' },
  { name: '运动户外', count: 42, color: '#eb2f96' },
  { name: '服饰美妆', count: 39, color: '#722ed1' },
  { name: '其他', count: 37, color: '#13c2c2' },
]

const recentItems = [
  { title: '《数据结构》教材 9成新', price: 25, time: '10 分钟前' },
  { title: '机械键盘 Cherry 青轴', price: 180, time: '25 分钟前' },
  { title: '台灯 LED 护眼', price: 35, time: '1 小时前' },
  { title: '四级词汇书（赠笔记）', price: 15, time: '2 小时前' },
  { title: 'iPad 保护壳 全新', price: 28, time: '3 小时前' },
]
</script>

<template>
  <div class="board">
    <h2 class="board-title">📊 数据看板</h2>

    <!-- 统计卡片 -->
    <section class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-value">
          {{ typeof s.value === 'number' ? s.value.toLocaleString() : s.value }}
          <span class="stat-unit">{{ s.unit }}</span>
        </div>
        <div class="stat-label">
          {{ s.label }}
          <span v-if="s.trend === 'up'" class="trend up">↑</span>
          <span v-else-if="s.trend === 'down'" class="trend down">↓</span>
          <span v-else class="trend flat">→</span>
        </div>
      </div>
    </section>

    <!-- 分类分布 + 最新发布 -->
    <section class="board-row">
      <div class="board-panel">
        <h3>商品分类分布</h3>
        <ul class="category-list">
          <li v-for="c in categories" :key="c.name" class="category-item">
            <span class="category-name">
              <span class="dot" :style="{ background: c.color }"></span>
              {{ c.name }}
            </span>
            <span class="category-count">{{ c.count }} 件</span>
          </li>
        </ul>
      </div>

      <div class="board-panel">
        <h3>最新发布</h3>
        <ul class="recent-list">
          <li v-for="item in recentItems" :key="item.title" class="recent-item">
            <div class="recent-info">
              <span class="recent-title">{{ item.title }}</span>
              <span class="recent-time">{{ item.time }}</span>
            </div>
            <span class="recent-price">¥{{ item.price }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.board {
  max-width: 960px;
}

.board-title {
  margin-bottom: 24px;
  font-size: 22px;
}

/* 统计卡片 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-unit {
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}

.stat-label {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.trend {
  margin-left: 4px;
  font-size: 12px;
}

.trend.up { color: #52c41a; }
.trend.down { color: #ff4d4f; }
.trend.flat { color: #999; }

/* 双栏布局 */
.board-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.board-panel {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
}

.board-panel h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

/* 分类列表 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.category-count {
  font-size: 13px;
  color: #999;
}

/* 最新发布 */
.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-time {
  font-size: 12px;
  color: #bbb;
}

.recent-price {
  font-size: 15px;
  font-weight: 600;
  color: #ff4d4f;
  flex-shrink: 0;
  margin-left: 12px;
}
</style>
