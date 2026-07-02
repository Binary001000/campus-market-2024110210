<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getTrades, type TradeItem } from '../api/trade'
import ItemCard from '../components/ItemCard.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const router = useRouter()

const searchKeyword = ref('')

function handleSearch() {
  const q = searchKeyword.value.trim()
  router.push(q ? `/list?search=${encodeURIComponent(q)}` : '/list')
}

const entries = [
  {
    type: 'secondhand', label: '二手集市', desc: '闲置物品买卖', route: '/list',
    color: '#2563eb', bg: '#eff6ff',
    svg: '<svg viewBox="0 0 32 32" fill="none"><path d="M4 10h24L26 28H6L4 10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 10V7a3 3 0 016 0v3M17 10V7a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="18" r="2" fill="currentColor"/><circle cx="20" cy="18" r="2" fill="currentColor"/></svg>',
  },
  {
    type: 'lostfound', label: '失物招领', desc: '丢失 & 拾获互助', route: '/lost-found',
    color: '#f59e0b', bg: '#fffbeb',
    svg: '<svg viewBox="0 0 32 32" fill="none"><circle cx="14" cy="14" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 14h4M14 12v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  },
  {
    type: 'group', label: '拼单搭子', desc: '拼单 & 找搭子', route: '/group-buy',
    color: '#10b981', bg: '#ecfdf5',
    svg: '<svg viewBox="0 0 32 32" fill="none"><circle cx="11" cy="10" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="21" cy="10" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M5 26c0-4.418 2.686-8 6-8M27 26c0-4.418-2.686-8-6-8M11 18c-3.314 0-6 3.582-6 8M21 18c3.314 0 6 3.582 6 8M11 18c1.105 0 2.5.5 5 1.5 2.5-1 3.895-1.5 5-1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  },
  {
    type: 'errand', label: '跑腿委托', desc: '代取快递 & 代办事务', route: '/errand',
    color: '#8b5cf6', bg: '#f5f3ff',
    svg: '<svg viewBox="0 0 32 32" fill="none"><circle cx="14" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 28c0-5 2.686-8 6-8M24 28c0-5-2.686-8-6-8M8 28c0-4.418 2.686-8 6-8M24 28c0-4.418-2.686-8-6-8" stroke="currentColor" stroke-width="1.6"/><path d="M10 19l2-4h8l2 4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 15h4l1 4M12 15H8l-1 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16 6v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="12" r="1" fill="currentColor"/></svg>',
  },
]

const trades = ref<TradeItem[]>([])
const hLoading = ref(true)
const hError = ref(false)

async function loadHomeData() {
  hLoading.value = true
  hError.value = false
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch {
    hError.value = true
  } finally {
    hLoading.value = false
  }
}

onMounted(loadHomeData)

const stats = computed(() => [
  { label: '在售商品', value: trades.value.filter(t => t.status === 'open').length },
  { label: '总商品', value: trades.value.length },
  { label: '活跃用户', value: new Set(trades.value.map(t => t.publisher)).size },
])

const latestItems = computed(() =>
  [...trades.value].sort((a, b) => b.publishTime.localeCompare(a.publishTime)).slice(0, 4),
)
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg-pattern" />
      <div class="hero-content">
        <h2 class="hero-title">今天想淘点什么？</h2>
        <p class="hero-subtitle">校园好物，触手可及</p>
        <div class="hero-search">
          <el-input
            v-model="searchKeyword"
            size="large"
            placeholder="搜索二手教材、电子产品..."
            :prefix-icon="Search"
            class="hero-input"
            @keydown.enter="handleSearch"
          />
        </div>
      </div>
    </section>

    <section class="entry-section">
      <div class="entry-grid">
        <RouterLink
          v-for="e in entries"
          :key="e.type"
          :to="e.route"
          class="entry-card"
          :style="{ '--card-color': e.color, '--card-bg': e.bg }"
        >
          <div class="entry-icon-wrap" :style="{ background: e.bg, color: e.color }" v-html="e.svg" />
          <div class="entry-label">{{ e.label }}</div>
          <div class="entry-desc">{{ e.desc }}</div>
        </RouterLink>
      </div>
    </section>

    <LoadingState v-if="hLoading" text="正在加载..." />
    <ErrorState v-else-if="hError" message="数据加载失败" show-retry @retry="loadHomeData" />

    <section v-else class="stat-section">
      <div class="stat-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card">
          <div class="stat-value">{{ s.value.toLocaleString() }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <section class="feed-section">
      <div class="section-header">
        <h3 class="section-title">最新发布</h3>
        <RouterLink to="/list" class="section-more">查看更多 →</RouterLink>
      </div>
      <div class="feed-grid">
        <ItemCard
          v-for="item in latestItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :image="item.image"
          :price="item.price"
          :tag="item.category"
          :location="item.campus"
          :to="`/detail/${item.id}`"
        />
      </div>
    </section>

    <section class="quick-section">
      <RouterLink to="/publish" class="quick-link">
        <el-button type="primary" size="large" round class="quick-btn">发布信息</el-button>
      </RouterLink>
      <RouterLink to="/message" class="quick-link">
        <el-button size="large" round class="quick-btn quick-btn-ghost">消息中心</el-button>
      </RouterLink>
      <RouterLink to="/board" class="quick-link">
        <el-button size="large" round class="quick-btn quick-btn-ghost">数据看板</el-button>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home { max-width: 1080px; }

.hero {
  position: relative;
  background: linear-gradient(135deg, #2563eb 0%, #4f8cf7 100%);
  border-radius: var(--radius-xl, 16px);
  padding: 48px 48px 40px;
  margin-bottom: 24px;
  text-align: center;
  overflow: hidden;
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.hero-subtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  margin: 0 0 24px;
}

.hero-search {
  max-width: 480px;
  margin: 0 auto;
}

.hero-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-full, 24px);
  background: rgba(255,255,255,0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.entry-section { margin-bottom: 24px; }

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.entry-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s, box-shadow 0.25s;
  cursor: pointer;
}

.entry-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--card-color);
}

.entry-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-icon-wrap :deep(svg) {
  width: 28px;
  height: 28px;
}

.entry-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.entry-desc {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}

.stat-section { margin-bottom: 24px; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary, #2563eb);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.feed-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #111827);
  margin: 0;
}

.section-more {
  font-size: 13px;
  color: var(--color-primary, #2563eb);
  text-decoration: none;
  font-weight: 500;
}

.feed-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .feed-grid { grid-template-columns: repeat(2, 1fr); }
  .entry-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .feed-grid { grid-template-columns: 1fr; }
  .entry-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-grid { grid-template-columns: 1fr; }
  .hero { padding: 32px 20px; }
  .hero-title { font-size: 22px; }
}

.quick-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-link { text-decoration: none; }

.quick-btn {
  height: 44px;
  font-size: 14px;
  font-weight: 600;
  padding: 0 28px;
}

.quick-btn-ghost {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  color: var(--text-primary, #374151);
}
</style>
