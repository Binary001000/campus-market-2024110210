<template>
  <div class="user-center">
    <div v-if="!userStore.isLoggedIn" class="not-logged-in">
      <div class="icon-wrap">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-4.8 0-8.4 2.1-8.4 4.8v2.4h16.8v-2.4c0-2.7-3.6-4.8-8.4-4.8z"/></svg>
      </div>
      <p class="not-logged-in-text">请先登录后查看个人中心</p>
      <el-button type="primary" size="large" @click="openLogin">去登录</el-button>
    </div>

    <template v-else>
      <ErrorState v-if="loadError" message="加载用户信息失败" @retry="fetchPublished" />
      <div v-else class="uc-content">
        <div class="uc-sidebar">
          <div class="uc-profile-card">
            <div class="uc-avatar" :style="{ background: avatarColor }">{{ userStore.displayName.charAt(0) }}</div>
            <h2 class="uc-name">{{ userStore.displayName }}</h2>
            <p class="uc-meta">{{ userStore.userDescription }}</p>
            <p v-if="currentUser.bio" class="uc-bio">{{ currentUser.bio }}</p>
            <el-divider />
            <div class="uc-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.total }}</span>
                <span class="stat-label">全部发布</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.active }}</span>
                <span class="stat-label">进行中</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ unreadCount }}</span>
                <span class="stat-label">未读消息</span>
              </div>
            </div>
          </div>
        </div>

        <div class="uc-main">
          <div class="uc-tabs">
            <el-radio-group v-model="activeTab" size="large">
              <el-radio-button value="published">我的发布</el-radio-button>
              <el-radio-button value="favorites">我的收藏</el-radio-button>
            </el-radio-group>
          </div>

          <div v-if="loading" class="uc-grid">
            <SkeletonCard v-for="n in 6" :key="n" width="100%" />
          </div>

          <EmptyState v-else-if="!items.length" :text="emptyMessage" />

          <div v-else class="uc-grid">
            <ItemCard
              v-for="item in items"
              :key="item.id"
              :title="item.title"
              :description="item.description"
              :tag="item.category || item.type || item.status"
              :location="item.location"
              :time="item.publishTime || item.eventTime"
              :to="detailPath(item)"
              :image="item.image"
              :price="item.price"
            >
              <template #footer>
                <el-button size="small" type="danger" plain @click="handleDelete(item)">删除</el-button>
              </template>
            </ItemCard>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore, type CurrentUser } from '../stores/user'
import { useFavoriteStore } from '../stores/favorite'
import { useMessageStore } from '../stores/message'
import { getTrades, deleteTrade } from '../api/trade'
import { getGroupBuys, deleteGroupBuy } from '../api/groupBuy'
import { getErrands, deleteErrand } from '../api/errand'
import { getLostFounds, deleteLostFound } from '../api/lostFound'
import { ElMessage, ElMessageBox } from 'element-plus'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import SkeletonCard from '../components/SkeletonCard.vue'

interface PublishItem {
  id: number
  title: string
  description: string
  category?: string
  type?: string
  status: string
  location: string
  publishTime?: string
  eventTime?: string
  image?: string
  price?: number
  _type: string
}
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const messageStore = useMessageStore()

const avatarColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
const activeTab = ref('published')
const loading = ref(false)
const loadError = ref(false)
const published = ref<PublishItem[]>([])

const currentUser = computed<CurrentUser>(() => userStore.currentUser)

const unreadCount = computed(() => messageStore.totalUnread)

const items = computed(() => {
  if (activeTab.value === 'published') return published.value
  return favoriteStore.favorites.map((f) => ({
    ...f,
    _type: f.type,
  })) as unknown as PublishItem[]
})

const emptyMessage = computed(() => {
  if (activeTab.value === 'published') return '还没有发布过内容'
  return '还没有收藏过内容'
})

const stats = computed(() => {
  const all = published.value
  return {
    total: all.length,
    active: all.filter((i) => i.status === 'open').length,
  }
})

async function fetchPublished() {
  if (!userStore.currentUser.id) return
  loading.value = true
  loadError.value = false
  try {
    const [
      { data: trades },
      { data: groupBuys },
      { data: errands },
      { data: lostFounds },
    ] = await Promise.all([
      getTrades(),
      getGroupBuys(),
      getErrands(),
      getLostFounds(),
    ])

    const publisher = userStore.displayName
    const all = [
      ...trades.filter((t) => t.publisher === publisher).map((t) => ({ ...t, _type: 'trade' })),
      ...groupBuys.filter((g) => g.publisher === publisher).map((g) => ({ ...g, _type: 'groupBuy' })),
      ...errands.filter((e) => e.publisher === publisher).map((e) => ({ ...e, _type: 'errand' })),
      ...lostFounds.filter((l) => l.publisher === publisher).map((l) => ({ ...l, _type: 'lostFound' })),
    ]
    published.value = all as PublishItem[]
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

function detailPath(item: PublishItem) {
  return item._type === 'trade'
    ? `/detail/trades/${item.id}`
    : `/detail/${item._type}/${item.id}`
}

async function handleDelete(item: PublishItem) {
  try {
    await ElMessageBox.confirm(`确定删除「${item.title}」？`, '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  try {
    const apis: Record<string, (id: number) => Promise<unknown>> = {
      trade: deleteTrade,
      groupBuy: deleteGroupBuy,
      errand: deleteErrand,
      lostFound: deleteLostFound,
    }
    await apis[item._type]!(item.id)
    ElMessage.success('删除成功')
    published.value = published.value.filter((p) => p.id !== item.id || p._type !== item._type)
  } catch {
    ElMessage.error('删除失败')
  }
}

function openLogin() {
  const header = document.querySelector('.app-header')
  if (header) {
    const btn = header.querySelector('.el-button--primary') as HTMLElement
    btn?.click()
  }
}

watch(activeTab, (tab) => {
  if (tab === 'favorites') {
    favoriteStore.loadFavorites()
  }
})

onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchPublished()
  }
})
</script>

<style scoped>
.user-center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  color: var(--text-secondary, #6b7280);
}

.icon-wrap svg {
  color: var(--text-tertiary, #9ca3af);
}

.not-logged-in-text {
  font-size: 16px;
  margin: 0;
}

.uc-content {
  display: flex;
  gap: 28px;
}

.uc-sidebar {
  width: 260px;
  flex-shrink: 0;
}

.uc-profile-card {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  padding: 28px 20px;
  text-align: center;
  position: sticky;
  top: calc(64px + 28px);
}

.uc-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  margin: 0 auto 12px;
}

.uc-name {
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--text-primary, #1a1a2e);
}

.uc-meta {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.uc-bio {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--text-tertiary, #9ca3af);
  font-style: italic;
}

.uc-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #111827);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.uc-main {
  flex: 1;
  min-width: 0;
}

.uc-tabs {
  margin-bottom: 20px;
}

.uc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
