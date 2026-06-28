<script setup lang="ts">
interface StatItem {
  label: string
  value: number
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
  { name: '教材教辅', count: 86, type: '' as const },
  { name: '电子产品', count: 64, type: 'success' as const },
  { name: '生活用品', count: 58, type: 'warning' as const },
  { name: '运动户外', count: 42, type: 'danger' as const },
  { name: '服饰美妆', count: 39, type: 'info' as const },
  { name: '其他', count: 37, type: '' as const },
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
    <el-row :gutter="16" class="stat-row">
      <el-col v-for="s in stats" :key="s.label" :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">
            {{ s.value.toLocaleString() }}
            <span class="stat-unit">{{ s.unit }}</span>
          </div>
          <div class="stat-label">
            {{ s.label }}
            <span v-if="s.trend === 'up'" class="trend up">↑</span>
            <span v-else-if="s.trend === 'down'" class="trend down">↓</span>
            <span v-else class="trend flat">→</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类 + 最新发布 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>商品分类分布</span>
          </template>
          <div v-for="c in categories" :key="c.name" class="category-item">
            <el-tag :type="c.type || undefined" size="small">{{ c.name }}</el-tag>
            <span class="category-count">{{ c.count }} 件</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>最新发布</span>
          </template>
          <div v-for="item in recentItems" :key="item.title" class="recent-item">
            <div class="recent-info">
              <span class="recent-title">{{ item.title }}</span>
              <span class="recent-time">{{ item.time }}</span>
            </div>
            <span class="recent-price">¥{{ item.price }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.board {
  max-width: 1080px;
}

.board-title {
  margin-bottom: 20px;
  font-size: 22px;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.stat-unit {
  font-size: 14px;
  font-weight: 400;
  color: #909399;
  margin-left: 2px;
}

.stat-label {
  margin-top: 6px;
  font-size: 13px;
  color: #909399;
}

.trend {
  margin-left: 4px;
  font-size: 12px;
}
.trend.up { color: #67c23a; }
.trend.down { color: #f56c6c; }
.trend.flat { color: #909399; }

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f2f2f2;
}
.category-item:last-child { border-bottom: none; }

.category-count {
  font-size: 13px;
  color: #909399;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f2f2f2;
}
.recent-item:last-child { border-bottom: none; }

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-time {
  font-size: 12px;
  color: #c0c4cc;
}

.recent-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  flex-shrink: 0;
  margin-left: 12px;
}
</style>
