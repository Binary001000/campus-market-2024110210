<script setup lang="ts">
// 二手集市列表页 — 支持搜索、校区筛选、状态筛选、价格排序、分页
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getTrades, type TradeItem } from '../api/trade'
import EmptyState from '../components/EmptyState.vue'
import { useFavoriteStore } from '../stores/favorite'

const favoriteStore = useFavoriteStore()

// 数据加载
const items = ref<TradeItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getTrades()
    items.value = res.data
  } catch (e) {
    console.error('获取数据失败', e)
  } finally {
    loading.value = false
  }
})

// 筛选条件状态
const searchQuery = ref('')
const selectedCampus = ref('全部校区')
const selectedSort = ref('最新发布')
const selectedStatus = ref('全部状态')
const currentPage = ref(1)
const pageSize = 4

// 筛选选项配置
const campusOptions = ['全部校区', '北校区', '南校区', '东校区', '西校区']
const sortOptions = ['最新发布', '价格↑', '价格↓']
const statusOptions = ['全部状态', 'open', 'closed', 'done']
const statusLabels: Record<string, string> = { open: '进行中', closed: '已关闭', done: '已完成' }

// 筛选 + 排序（响应式计算）
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

// 分页切片
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})
</script>

<template>
  <div class="list-page">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-card shadow="never" class="filter-card">
        <div class="filter-row">
          <el-input
            v-model="searchQuery"
            placeholder="搜索二手商品..."
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

    <!-- 加载中 -->
    <div v-if="loading" class="loading-wrap">
      <el-icon class="loading-icon"><Search /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 列表 -->
    <template v-else-if="pagedItems.length">
      <div class="item-list">
        <RouterLink
          v-for="item in pagedItems"
          :key="item.id"
          :to="`/detail/${item.id}`"
          class="item-link"
        >
          <el-card shadow="hover" class="item-card">
            <div class="item-layout">
              <div class="item-thumb">
                <img v-if="item.image" :src="item.image" alt="" class="thumb-img" referrerpolicy="no-referrer" />
                <span v-else class="thumb-icon">📷</span>
              </div>
              <div class="item-body">
                <div class="item-top">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="item-price">¥{{ item.price }}</span>
                </div>
                <p class="item-desc">{{ item.description }}</p>
                <div class="item-bottom">
                  <div class="item-tags">
                    <el-tag size="small">{{ item.category }}</el-tag>
                    <el-tag size="small" type="info" effect="plain">{{ item.campus }}</el-tag>
                    <span :class="['status-dot', item.status === 'open' ? 'active' : item.status === 'done' ? 'done' : 'closed']"></span>
                    <span class="status-text">{{ statusLabels[item.status] || item.status }}</span>
                  </div>
                  <span class="item-time">{{ item.publishTime }}</span>
                  <button
                    class="fav-btn"
                    @click.prevent="favoriteStore.toggleFavorite({
                      id: item.id!,
                      type: 'trade',
                      title: item.title,
                      description: item.description,
                      location: item.location
                    })"
                  >
                    {{ favoriteStore.isFavorite('trade', item.id!) ? '❤️ 已收藏' : '🤍 收藏' }}
                  </button>
                </div>
              </div>
            </div>
          </el-card>
        </RouterLink>
      </div>

      <!-- 分页 -->
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

    <!-- 空状态 -->
    <EmptyState v-else text="还没有二手商品，去发布第一条吧～" />

    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<style scoped>
.list-page { max-width: 900px; }

.filter-bar { position: sticky; top: 56px; z-index: 100; margin-bottom: 16px; }
.filter-card { border-radius: 12px; }
.filter-card :deep(.el-card__body) { padding: 12px 16px; }
.filter-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filter-search { width: 240px; }
.filter-search :deep(.el-input__wrapper) { border-radius: 24px; }
.filter-select { width: 110px; }
.filter-select-sort { width: 120px; }

.loading-wrap { text-align: center; padding: 48px; color: #9ca3af; }
.loading-icon { font-size: 32px; }

.item-list { display: flex; flex-direction: column; gap: 12px; }
.item-link { text-decoration: none; color: inherit; }
.item-card { border-radius: 12px; border-left: 3px solid transparent; transition: all 0.2s ease; }
.item-card:hover { border-left-color: #4a90d9; transform: translateX(2px); }
.item-layout { display: flex; gap: 16px; }
.item-thumb { width: 100px; height: 100px; border-radius: 8px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-icon { font-size: 28px; opacity: 0.4; }
.item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
.item-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.item-title { font-size: 16px; font-weight: 600; color: #1a1a2e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-price { font-size: 18px; font-weight: 700; color: #ff6b3d; flex-shrink: 0; }
.item-desc { font-size: 13px; color: #6b7280; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.item-tags { display: flex; align-items: center; gap: 8px; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-dot.active { background: #22c55e; }
.status-dot.done { background: #4a90d9; }
.status-dot.closed { background: #9ca3af; }
.status-text { font-size: 12px; color: #9ca3af; }
.item-time { font-size: 12px; color: #c0c4cc; flex-shrink: 0; }
.pagination-wrap { display: flex; justify-content: center; margin-top: 24px; }
</style>
