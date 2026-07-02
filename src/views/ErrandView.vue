<template>
  <section class="page">
    <div class="page-hero hero-errand">
      <div class="hero-content">
        <span class="hero-icon" v-html="heroIcon"></span>
        <div class="hero-text">
          <h1>跑腿委托</h1>
          <p>找人帮忙跑个腿，省时省力，互帮互助。</p>
        </div>
      </div>
      <div class="hero-stats">
        <span class="hero-stat">{{ stats.open }} 个待接单</span>
        <span class="hero-stat-divider"></span>
        <span class="hero-stat">{{ stats.done }} 个已完成</span>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <el-radio-group v-model="statusFilter" size="small">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="open">待接单</el-radio-button>
          <el-radio-button value="done">已完成</el-radio-button>
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
            <el-option label="酬劳↑" value="reward-asc" />
            <el-option label="酬劳↓" value="reward-desc" />
          </el-select>
        </div>
      </div>
    </el-card>

    <LoadingState v-if="loading" text="正在加载跑腿委托信息..." />

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
          :tag="item.taskType"
          :location="`${item.from} → ${item.to}`"
          :time="item.deadline"
          :extra="`¥${item.reward} 酬劳`"
          :to="`/detail/${item.id}?type=errand`"
        />
      </div>
    </template>

    <EmptyState v-else text="暂无跑腿委托信息" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import { getErrands, type ErrandItem } from '../api/errand'

const items = ref<ErrandItem[]>([])
const loading = ref(true)
const error = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('time')

const heroIcon = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="5" r="3"/><path d="M12 8v8l-4 4"/><path d="M12 16l4 4"/><path d="M8 12h8"/></svg>'

const stats = computed(() => {
  const open = items.value.filter((i) => i.status === 'open').length
  const done = items.value.filter((i) => i.status === 'done').length
  return { open, done }
})

const filteredItems = computed(() => {
  let result = [...items.value]

  if (statusFilter.value) {
    result = result.filter((i) => i.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    )
  }

  if (sortBy.value === 'time') {
    result.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
  } else if (sortBy.value === 'reward-asc') {
    result.sort((a, b) => a.reward - b.reward)
  } else if (sortBy.value === 'reward-desc') {
    result.sort((a, b) => b.reward - a.reward)
  }

  return result
})

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const res = await getErrands()
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

.hero-errand {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
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
