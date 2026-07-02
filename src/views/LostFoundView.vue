<template>
  <section class="page">
    <div class="page-hero hero-lostfound">
      <div class="hero-content">
        <span class="hero-icon" v-html="heroIcon"></span>
        <div class="hero-text">
          <h1>失物招领</h1>
          <p>丢失物品别着急，拾获物品等失主，互助让校园更温暖。</p>
        </div>
      </div>
      <div class="hero-stats">
        <span class="hero-stat">{{ stats.lost }} 条寻物</span>
        <span class="hero-stat-divider"></span>
        <span class="hero-stat">{{ stats.found }} 条招领</span>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-radio-group v-model="typeFilter" size="small">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="lost">寻物</el-radio-button>
          <el-radio-button value="found">拾获</el-radio-button>
        </el-radio-group>
        <div class="filter-right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索..."
            :prefix-icon="Search"
            clearable
            class="filter-search"
          />
          <el-select v-model="sortBy" size="small" class="filter-sort">
            <el-option label="最新发布" value="time" />
            <el-option label="按状态" value="status" />
          </el-select>
        </div>
      </div>
    </el-card>

    <LoadingState v-if="loading" text="正在加载失物招领信息..." />

    <ErrorState
      v-else-if="error"
      message="加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadData"
    />

    <template v-else-if="filteredItems.length">
      <div class="list">
        <ItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :tag="item.type === 'lost' ? '丢失' : '拾获'"
          :location="item.location"
          :time="item.eventTime"
          :to="`/detail/${item.id}?type=lostFound`"
        />
      </div>
    </template>

    <EmptyState v-else text="暂无失物招领信息" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'

const items = ref<LostFoundItem[]>([])
const loading = ref(true)
const error = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const sortBy = ref('time')

const heroIcon = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'

const stats = computed(() => {
  const lost = items.value.filter((i) => i.type === 'lost').length
  const found = items.value.filter((i) => i.type === 'found').length
  return { lost, found }
})

const filteredItems = computed(() => {
  let result = [...items.value]

  if (typeFilter.value) {
    result = result.filter((i) => i.type === typeFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    )
  }

  if (sortBy.value === 'time') {
    result.sort((a, b) => b.eventTime.localeCompare(a.eventTime))
  } else if (sortBy.value === 'status') {
    result.sort((a, b) => {
      const order: Record<string, number> = { open: 0, closed: 1, done: 2 }
      return (order[a.status] ?? 0) - (order[b.status] ?? 0)
    })
  }

  return result
})

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

.hero-lostfound {
  background: linear-gradient(135deg, #f97316, #f59e0b);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  color: #fff;
}

.hero-text h1 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #fff;
}

.hero-text p {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.85);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius-md, 8px);
  width: fit-content;
}

.hero-stat {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

.hero-stat-divider {
  width: 1px;
  height: 16px;
  background: rgba(255,255,255,0.3);
}

.page-hero {
  padding: 24px;
  border-radius: var(--radius-xl, 16px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card { border-radius: var(--radius-lg, 12px); }
.filter-card :deep(.el-card__body) { padding: 12px 16px; }

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-search { width: 200px; }
.filter-search :deep(.el-input__wrapper) { border-radius: var(--radius-full, 24px); }
.filter-sort { width: 120px; }

.list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 1024px) { .list { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .list { grid-template-columns: 1fr; } }
</style>
