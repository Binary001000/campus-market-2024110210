<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTrades, type TradeItem } from '../api/trade'
import ItemCard from '../components/ItemCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const items = ref<TradeItem[]>([])
const loading = ref(true)
const error = ref(false)

async function loadTrades() {
  loading.value = true
  error.value = false
  try {
    const res = await getTrades()
    items.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  loadTrades()
})

const searchQuery = ref('')
const selectedCampus = ref('全部校区')
const selectedSort = ref('最新发布')
const selectedStatus = ref('全部状态')
const currentPage = ref(1)
const pageSize = 6

const campusOptions = ['全部校区', '北校区', '南校区', '东校区', '西校区']
const sortOptions = ['最新发布', '价格↑', '价格↓']
const statusOptions = ['全部状态', 'open', 'closed', 'done']
const statusLabels: Record<string, string> = { open: '进行中', closed: '已关闭', done: '已完成' }

const filteredItems = computed(() => {
  let result = [...items.value]
  if (searchQuery.value) {
    result = result.filter(i => i.title.includes(searchQuery.value))
  }
  if (selectedCampus.value !== '全部校区') {
    result = result.filter(i => i.campus === selectedCampus.value)
  }
  if (selectedStatus.value !== '全部状态') {
    result = result.filter(i => i.status === selectedStatus.value)
  }
  if (selectedSort.value === '价格↑') {
    result.sort((a, b) => a.price - b.price)
  } else if (selectedSort.value === '价格↓') {
    result.sort((a, b) => b.price - a.price)
  } else {
    result.sort((a, b) => b.publishTime.localeCompare(a.publishTime))
  }
  return result
})

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

async function handleToggleFavorite(item: TradeItem) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再收藏')
    return
  }
  if (!item.id) return
  await favoriteStore.toggleFavorite({
    id: item.id,
    type: 'trade',
    title: item.title,
    description: item.description,
    location: item.location,
  })
}
</script>

<template>
  <div class="list-page">
    <div class="filter-bar">
      <el-card shadow="never" class="filter-card">
        <div class="filter-row">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品名称..."
            :prefix-icon="Search"
            class="filter-search"
            clearable
          />
          <el-select v-model="selectedCampus" class="filter-select">
            <el-option v-for="c in campusOptions" :key="c" :label="c" :value="c" />
          </el-select>
          <el-select v-model="selectedStatus" class="filter-select">
            <el-option v-for="s in statusOptions" :key="s" :label="s === '全部状态' ? s : statusLabels[s]" :value="s" />
          </el-select>
          <el-select v-model="selectedSort" class="filter-select-sort">
            <el-option v-for="s in sortOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
      </el-card>
    </div>

    <div v-if="loading" class="item-grid">
      <SkeletonCard v-for="n in 6" :key="n" />
    </div>

    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadTrades"
    />

    <template v-else-if="pagedItems.length">
      <div class="item-grid">
        <ItemCard
          v-for="item in pagedItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :image="item.image"
          :price="item.price"
          :tag="item.category"
          :location="item.campus"
          :time="item.publishTime"
          :to="`/detail/${item.id}`"
        >
          <template #footer>
            <button
              class="fav-btn"
              :class="{ 'is-fav': item.id && favoriteStore.isFavorite('trade', item.id) }"
              @click.prevent="handleToggleFavorite(item)"
            >
              <svg v-if="item.id && favoriteStore.isFavorite('trade', item.id)" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </template>
        </ItemCard>
      </div>

      <div v-if="filteredItems.length > pageSize" class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredItems.length"
          layout="prev, pager, next"
          background
          size="small"
        />
      </div>
    </template>

    <EmptyState v-else text="没有找到匹配的商品，试试其他关键词吧" />

    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<style scoped>
.list-page { max-width: 1080px; }

.filter-bar { position: sticky; top: 56px; z-index: 100; margin-bottom: 16px; }
.filter-card { border-radius: var(--radius-lg, 12px); }
.filter-card :deep(.el-card__body) { padding: 12px 16px; }
.filter-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filter-search { width: 220px; }
.filter-search :deep(.el-input__wrapper) { border-radius: var(--radius-full, 24px); }
.filter-select { width: 110px; }
.filter-select-sort { width: 120px; }

.item-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 1024px) {
  .item-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .item-grid { grid-template-columns: 1fr; }
  .filter-search { width: 100%; }
}

.fav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 4px 10px;
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-tertiary, #9ca3af);
  transition: all 0.2s;
}

.fav-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.fav-btn.is-fav {
  color: #ef4444;
  background: #fef2f2;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
