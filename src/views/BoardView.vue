<script setup lang="ts">
import { ref } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

const timeRange = ref('today')

interface StatItem {
  label: string; value: number; unit: string; change: number; trend: 'up' | 'down'
}
const stats: StatItem[] = [
  { label: '在售商品', value: 326, unit: '件', change: 12, trend: 'up' },
  { label: '活跃用户', value: 1280, unit: '人', change: 8, trend: 'up' },
  { label: '今日访问', value: 4567, unit: '次', change: 23, trend: 'up' },
  { label: '成交订单', value: 89, unit: '单', change: 5, trend: 'down' },
]

const categories = [
  { name: '教材教辅', count: 86, percent: 26, color: '#4a90d9' },
  { name: '电子产品', count: 64, percent: 20, color: '#52c41a' },
  { name: '生活用品', count: 58, percent: 18, color: '#faad14' },
  { name: '运动户外', count: 42, percent: 13, color: '#eb2f96' },
  { name: '服饰美妆', count: 39, percent: 12, color: '#722ed1' },
  { name: '其他', count: 37, percent: 11, color: '#13c2c2' },
]

const campusData = [
  { name: '北校区', count: 128, percent: 39, color: '#4a90d9' },
  { name: '南校区', count: 86, percent: 26, color: '#52c41a' },
  { name: '东校区', count: 65, percent: 20, color: '#faad14' },
  { name: '西校区', count: 47, percent: 15, color: '#eb2f96' },
]

const topItems = [
  { rank: 1, title: '《数据结构》教材 9成新', hot: 86 },
  { rank: 2, title: '机械键盘 Cherry 青轴', hot: 64 },
  { rank: 3, title: '蓝牙耳机 降噪版', hot: 51 },
  { rank: 4, title: '瑜伽垫 加厚防滑', hot: 42 },
  { rank: 5, title: '台灯 LED 护眼', hot: 38 },
]

const timeline = [
  { time: '10 分钟前', text: '张同学发布了《数据结构》教材' },
  { time: '25 分钟前', text: '李同学发布了机械键盘 Cherry 青轴' },
  { time: '1 小时前', text: '王同学的台灯已标记为已完成' },
  { time: '2 小时前', text: '赵同学收藏了考研英语真题集' },
]

const rankColor = (rank: number): string => {
  if (rank === 1) return '#f59e0b'
  if (rank === 2) return '#9ca3af'
  if (rank === 3) return '#cd7f32'
  return '#d1d5db'
}
</script>

<template>
  <div class="board">
    <!-- A. 标题 + 时间范围 -->
    <div class="board-header">
      <h2 class="board-title">数据看板</h2>
      <el-radio-group v-model="timeRange" size="small">
        <el-radio-button value="today">今日</el-radio-button>
        <el-radio-button value="week">本周</el-radio-button>
        <el-radio-button value="month">本月</el-radio-button>
      </el-radio-group>
    </div>

    <!-- B. 统计卡片 -->
    <div class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-top">
          <span class="stat-value">{{ s.value.toLocaleString() }}</span>
          <span class="stat-unit">{{ s.unit }}</span>
        </div>
        <div class="stat-label">{{ s.label }}</div>
        <div class="stat-trend">
          <span :class="['trend-arrow', s.trend]">
            {{ s.trend === 'up' ? '↑' : '↓' }}
          </span>
          <span :class="['trend-num', s.trend]">{{ s.change }}%</span>
          <span class="trend-vs">vs 昨日</span>
        </div>
      </div>
    </div>

    <!-- C. 图表区 -->
    <div class="chart-row">
      <!-- 分类占比环形图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header><span class="chart-title">分类占比</span></template>
        <div class="donut-wrap">
          <div class="donut-chart">
            <div class="donut-center">
              <span class="donut-total">326</span>
              <span class="donut-sub">总商品数</span>
            </div>
          </div>
          <div class="donut-legend">
            <div v-for="c in categories" :key="c.name" class="legend-item">
              <span class="legend-dot" :style="{ background: c.color }"></span>
              <span class="legend-name">{{ c.name }}</span>
              <span class="legend-val">{{ c.count }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 校区分布柱状图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header><span class="chart-title">校区分布</span></template>
        <div class="bar-wrap">
          <div v-for="c in campusData" :key="c.name" class="bar-item">
            <div class="bar-label">
              <span>{{ c.name }}</span>
              <span>{{ c.count }} 件</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: c.percent + '%', background: c.color }"
              ></div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- D. 底部列表区 -->
    <div class="chart-row">
      <!-- 热门 TOP5 -->
      <el-card class="chart-card" shadow="hover">
        <template #header><span class="chart-title">🔥 热门商品 TOP5</span></template>
        <div class="top-list">
          <div v-for="item in topItems" :key="item.rank" class="top-item">
            <span class="top-rank" :style="{ background: rankColor(item.rank) }">
              {{ item.rank }}
            </span>
            <span class="top-title">{{ item.title }}</span>
            <span class="top-hot">👁️ {{ item.hot }}</span>
          </div>
        </div>
      </el-card>

      <!-- 最新动态 -->
      <el-card class="chart-card" shadow="hover">
        <template #header><span class="chart-title">📋 最新动态</span></template>
        <el-timeline>
          <el-timeline-item
            v-for="(t, i) in timeline"
            :key="i"
            :timestamp="t.time"
            placement="top"
            size="small"
          >
            {{ t.text }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <!-- E. 安全提醒 -->
    <el-card class="safety-card">
      <div class="safety-content">
        <el-icon class="safety-icon"><WarningFilled /></el-icon>
        <div class="safety-text">
          <strong>交易安全提醒</strong>
          <p>建议在公共场合交易，贵重物品当面验货。警惕异常低价和异常交易要求，保护个人隐私和联系方式。</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.board {
  max-width: 1080px;
}

/* ===== A. 标题行 ===== */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

/* ===== B. 统计卡片 ===== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.25s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.stat-top {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-unit {
  font-size: 14px;
  color: #9ca3af;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-arrow { font-weight: 700; }
.trend-num { font-weight: 600; }
.trend-vs { color: #c0c4cc; }
.trend-arrow.up, .trend-num.up { color: #22c55e; }
.trend-arrow.down, .trend-num.down { color: #ef4444; }

/* ===== C. 图表区 ===== */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-card {
  border-radius: 12px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
}

/* 环形图 */
.donut-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-chart {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(
    #4a90d9 0% 26%,
    #52c41a 26% 46%,
    #faad14 46% 64%,
    #eb2f96 64% 77%,
    #722ed1 77% 89%,
    #13c2c2 89% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.donut-center {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-total {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1;
}

.donut-sub {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  color: #6b7280;
}

.legend-val {
  font-weight: 600;
  color: #374151;
}

/* 柱状图 */
.bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
}

.bar-track {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}

/* ===== D. TOP5 + 时间线 ===== */
.top-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.top-title {
  flex: 1;
  font-size: 14px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-hot {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* ===== E. 安全提醒 ===== */
.safety-card {
  border-radius: 12px;
  background: #fffbeb;
  border-color: #fde68a;
}

.safety-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.safety-icon {
  font-size: 22px;
  color: #f59e0b;
  margin-top: 2px;
  flex-shrink: 0;
}

.safety-text strong {
  font-size: 14px;
  color: #92400e;
}

.safety-text p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #a16207;
  line-height: 1.6;
}
</style>
