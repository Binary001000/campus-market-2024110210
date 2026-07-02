<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { getTrades, type TradeItem } from '../api/trade'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { countByField } from '../utils/statistics'

const timeRange = ref('today')
const trades = ref<TradeItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])

const stats = computed(() => [
  { label: '在售商品', value: trades.value.filter(t => t.status === 'open').length + groupBuys.value.filter(g => g.status === 'open').length, unit: '件', change: 12, trend: 'up' as const },
  { label: '拼单活动', value: groupBuys.value.length, unit: '个', change: 8, trend: 'up' as const },
  { label: '跑腿委托', value: errands.value.length, unit: '个', change: 23, trend: 'up' as const },
  { label: '失物招领', value: lostFounds.value.length, unit: '条', change: 5, trend: 'down' as const },
])

const totalActive = computed(() => trades.value.filter(t => t.status === 'open').length)

const categories = computed(() => {
  const counts = countByField(trades.value, 'category')
  const total = trades.value.length || 1
  return Object.entries(counts).map(([name, count], i) => ({
    name,
    count,
    percent: Math.round((count / total) * 100),
    color: (['#4a90d9', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'])[i % 6]!,
  }))
})

const campusData = computed(() => {
  const counts = countByField(trades.value, 'campus')
  const total = trades.value.length || 1
  return Object.entries(counts).map(([name, count], i) => ({
    name,
    count,
    percent: Math.round((count / total) * 100),
    color: (['#4a90d9', '#52c41a', '#faad14', '#eb2f96'])[i % 4]!,
  }))
})

const topItems = computed(() =>
  [...trades.value]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 5)
    .map((item, i) => ({
      rank: i + 1,
      title: item.title,
      hot: 100 - i * 15,
    })),
)

const timeline = computed(() =>
  [...trades.value]
    .sort((a, b) => b.publishTime.localeCompare(a.publishTime))
    .slice(0, 4)
    .map((item) => ({
      time: item.publishTime,
      text: `${item.publisher} 发布了「${item.title}」`,
    })),
)

const rankColor = (rank: number): string => {
  if (rank === 1) return '#f59e0b'
  if (rank === 2) return '#9ca3af'
  if (rank === 3) return '#cd7f32'
  return '#d1d5db'
}

const donutBackground = computed(() => {
  if (categories.value.length === 0) return '#e5e7eb'
  const parts = categories.value.map(
    (c, i) => {
      const start = categories.value.slice(0, i).reduce((s, x) => s + x.percent, 0)
      return `${c.color} ${start}% ${start + c.percent}%`
    },
  )
  return `conic-gradient(${parts.join(', ')})`
})

onMounted(async () => {
  const [t, g, e, l] = await Promise.all([
    getTrades().then(r => r.data),
    getGroupBuys().then(r => r.data),
    getErrands().then(r => r.data),
    getLostFounds().then(r => r.data),
  ])
  trades.value = t
  groupBuys.value = g
  errands.value = e
  lostFounds.value = l
})
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
          <div class="donut-chart" :style="{ background: donutBackground }">
            <div class="donut-center">
              <span class="donut-total">{{ totalActive }}</span>
              <span class="donut-sub">在售商品</span>
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

@media (max-width: 768px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .chart-row { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr; }
  .board-header { flex-direction: column; gap: 12px; align-items: flex-start; }
}
</style>
