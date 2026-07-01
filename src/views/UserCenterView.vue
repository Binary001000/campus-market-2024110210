<template>
  <section class="page">
    <!-- 用户资料 -->
    <div class="profile-card">
      <div class="avatar">
        {{ userStore.displayName.slice(0, 1) }}
      </div>
      <div>
        <h1>{{ userStore.displayName }}</h1>
        <p>{{ userStore.userDescription }}</p>
        <p>{{ userStore.currentUser.bio }}</p>
      </div>
    </div>

    <!-- 数据行 -->
    <div class="stat-row">
      <div class="stat-item"><div class="stat-num">{{ myPublishes.length }}</div><div class="stat-label">我的发布</div></div>
      <div class="stat-item"><div class="stat-num">{{ favoriteStore.favoriteCount }}</div><div class="stat-label">我的收藏</div></div>
      <div class="stat-item"><div class="stat-num">0</div><div class="stat-label">未读消息</div></div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'publishes' }" @click="activeTab = 'publishes'">我的发布</button>
      <button :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">我的收藏</button>
    </div>

    <!-- 我的发布 -->
    <div v-if="activeTab === 'publishes'" class="panel">
      <div v-if="loading" class="loading-wrap">加载中...</div>
      <EmptyState v-else-if="myPublishes.length === 0" text="暂无发布内容" />
      <div v-else class="publish-list">
        <div v-for="item in myPublishes" :key="`${item.type}-${item.id}`" class="publish-item">
          <div class="publish-left">
            <span class="publish-title">{{ item.title }}</span>
            <div class="publish-meta">
              <span class="tag">{{ getTypeLabel(item.type) }}</span>
              <span class="publish-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div v-if="activeTab === 'favorites'" class="panel">
      <EmptyState v-if="favoriteStore.favorites.length === 0" text="暂无收藏内容" />
      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
        >
          <template #footer>
            <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
              取消收藏
            </button>
          </template>
        </ItemCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const activeTab = ref<'publishes' | 'favorites'>('publishes')
const loading = ref(true)
const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  try {
    const [tRes, lRes, gRes, eRes] = await Promise.all([
      getTrades(), getLostFounds(), getGroupBuys(), getErrands(),
    ])
    trades.value = tRes.data
    lostFounds.value = lRes.data
    groupBuys.value = gRes.data
    errands.value = eRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

interface PublishRecord {
  id: number
  title: string
  type: string
  time: string
}

const myPublishes = computed<PublishRecord[]>(() => {
  return [
    ...trades.value
      .filter(t => t.publisher === userStore.displayName)
      .map(t => ({ id: t.id!, title: t.title, type: 'trade', time: t.publishTime })),
    ...lostFounds.value
      .filter(l => l.publisher === userStore.displayName)
      .map(l => ({ id: l.id!, title: l.title, type: 'lostFound', time: l.eventTime })),
    ...groupBuys.value
      .filter(g => g.publisher === userStore.displayName)
      .map(g => ({ id: g.id!, title: g.title, type: 'groupBuy', time: g.deadline })),
    ...errands.value
      .filter(e => e.publisher === userStore.displayName)
      .map(e => ({ id: e.id!, title: e.title, type: 'errand', time: e.deadline })),
  ]
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易', lostFound: '失物招领', groupBuy: '拼单搭子', errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.profile-card h1,
.panel h2 {
  margin: 0 0 8px;
}

.profile-card p,
.hint {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

/* 数据行 */
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e5e7eb;
  border-radius: 10px; overflow: hidden; }
.stat-item { background: #fff; padding: 16px; text-align: center; }
.stat-num { font-size: 22px; font-weight: 700; }
.stat-label { font-size: 12px; color: #9ca3af; margin-top: 2px; }

.favorite-list {
  display: grid;
  gap: 16px;
}

.remove-btn {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}
</style>
