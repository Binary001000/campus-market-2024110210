<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import { useFavoriteStore } from '../stores/favorite'
import { useMessageStore } from '../stores/message'
import { useUserStore } from '../stores/user'
import { getTradeById, deleteTrade, type TradeItem } from '../api/trade'
import { getGroupBuys, updateGroupBuy, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, updateErrand, type ErrandItem } from '../api/errand'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getUsers, type UserRecord } from '../api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const messageStore = useMessageStore()
const userStore = useUserStore()

const itemId = Number(route.params.id)
const itemType = (route.query.type as string) || 'trade'

const item = ref<TradeItem | GroupBuyItem | ErrandItem | LostFoundItem | null>(null)
const loading = ref(true)
const error = ref(false)
const deleting = ref(false)

const isTrade = computed(() => itemType === 'trade')
const isGroupBuy = computed(() => itemType === 'groupBuy')
const isErrand = computed(() => itemType === 'errand')
const isLostFound = computed(() => itemType === 'lostFound')

const tradeItem = computed(() => item.value as TradeItem | null)
const groupBuyItem = computed(() => item.value as GroupBuyItem | null)
const errandItem = computed(() => item.value as ErrandItem | null)
const lostFoundItem = computed(() => item.value as LostFoundItem | null)

const statusLabels: Record<string, string> = { open: '进行中', closed: '已关闭', done: '已完成' }

const isFavorited = computed(() => {
  if (!item.value?.id) return false
  return favoriteStore.isFavorite(itemType as 'trade' | 'lostFound' | 'groupBuy' | 'errand', item.value.id)
})

const listRoute = computed(() => {
  const map: Record<string, string> = { trade: '/list', groupBuy: '/group-buy', errand: '/errand', lostFound: '/lost-found' }
  return map[itemType] || '/'
})

const listLabel = computed(() => {
  const map: Record<string, string> = { trade: '二手集市', groupBuy: '拼单搭子', errand: '跑腿委托', lostFound: '失物招领' }
  return map[itemType] || '列表'
})

async function loadDetail() {
  loading.value = true
  error.value = false
  try {
    if (isTrade.value) {
      const res = await getTradeById(itemId)
      item.value = res.data
    } else if (isGroupBuy.value) {
      const res = await getGroupBuys()
      item.value = res.data.find((i) => i.id === itemId) ?? null
    } else if (isErrand.value) {
      const res = await getErrands()
      item.value = res.data.find((i) => i.id === itemId) ?? null
    } else if (isLostFound.value) {
      const res = await getLostFounds()
      item.value = res.data.find((i) => i.id === itemId) ?? null
    }
  } catch (e) {
    console.error('获取详情失败', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function handleToggleFavorite() {
  if (!item.value?.id) return
  const favItem = {
    id: item.value.id,
    type: itemType as 'trade' | 'lostFound' | 'groupBuy' | 'errand',
    title: item.value.title,
    description: item.value.description,
  }
  await favoriteStore.toggleFavorite(favItem)
}

async function handleContact() {
  if (!item.value?.id) return
  await messageStore.loadConversations()
  let conv = messageStore.conversations.find(
    (c) => c.itemType === itemType && c.itemId === itemId && c.participants.includes(userStore.currentUser.id),
  )
  if (!conv) {
    const otherId = await findUserIdByName(item.value.publisher)
    if (!otherId) {
      ElMessage.error('无法找到发布者')
      return
    }
    const res = await (await import('../api/message')).createConversation({
      participants: [userStore.currentUser.id, otherId],
      itemType,
      itemId,
      lastMessage: '',
      lastTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      unreadCount: 0,
    })
    conv = { ...res.data, peerName: '', id: res.data.id! }
  }
  if (!conv) return
  router.push(`/message?convId=${conv.id}`)
}

async function findUserIdByName(name: string): Promise<number | null> {
  try {
    const { data: users } = await getUsers()
    return users.find((u: UserRecord) => u.name === name)?.id ?? null
  } catch {
    return null
  }
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定删除？此操作不可撤销。', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  deleting.value = true
  try {
    if (isTrade.value) {
      await deleteTrade(itemId)
    }
    ElMessage.success('删除成功')
    router.push(listRoute.value)
  } catch (e) {
    console.error('删除失败', e)
    ElMessage.error('删除失败')
  } finally {
    deleting.value = false
  }
}

async function handleJoinGroupBuy() {
  if (!isGroupBuy.value || !groupBuyItem.value) return
  const gb = groupBuyItem.value
  if (gb.currentCount >= gb.targetCount) {
    ElMessage.warning('拼单人数已满')
    return
  }
  await updateGroupBuy(gb.id!, { currentCount: gb.currentCount + 1 })
  gb.currentCount++
  ElMessage.success('已成功加入拼单！')
}

async function handleAcceptErrand() {
  if (!isErrand.value || !errandItem.value) return
  await updateErrand(errandItem.value.id!, { status: 'done' })
  errandItem.value.status = 'done'
  ElMessage.success('已接单，快去完成任务吧！')
}

const bargainVisible = ref(false)
const bargainPrice = ref(0)

function openBargain() {
  if (!tradeItem.value) return
  bargainPrice.value = Math.round(tradeItem.value.price * 0.8)
  bargainVisible.value = true
}

async function handleBargain() {
  if (!tradeItem.value) return
  const price = tradeItem.value.price
  const offered = bargainPrice.value
  const ratio = offered / price

  await new Promise((r) => setTimeout(r, 1500))

  if (ratio >= 0.8) {
    ElMessage.success('卖家接受了你的砍价！')
  } else if (ratio >= 0.6) {
    ElMessage.info('卖家回复：再考虑一下')
  } else {
    ElMessage.warning('卖家拒绝了砍价')
  }
  bargainVisible.value = false
}

onMounted(async () => {
  await favoriteStore.loadFavorites()
  await loadDetail()
})
</script>

<template>
  <div class="detail-page">
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: listRoute }">{{ listLabel }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ item?.title || '详情' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <LoadingState v-if="loading" text="正在加载详情..." />

    <ErrorState
      v-else-if="error"
      message="详情加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadDetail"
    />

    <el-result
      v-else-if="!item"
      icon="warning"
      title="内容不存在"
      sub-title="该内容可能已下架或删除"
    >
      <template #extra>
        <el-button type="primary" @click="router.push(listRoute)">返回{{ listLabel }}</el-button>
      </template>
    </el-result>

    <template v-else>
      <div class="detail-content">
        <div class="detail-image-col">
          <div class="detail-image-wrap">
            <img v-if="isTrade && tradeItem?.image" :src="tradeItem.image" alt="" referrerpolicy="no-referrer" />
            <div v-else class="detail-image-placeholder">
              <span class="placeholder-icon">{{ isTrade ? '🛒' : isGroupBuy ? '👥' : isErrand ? '🏃' : '🔍' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-info-col">
          <div class="detail-header">
            <h1 class="detail-title">{{ item.title }}</h1>
            <div class="detail-price-bar">
              <template v-if="isTrade && tradeItem">
                <span class="detail-price">¥{{ tradeItem.price }}</span>
                <span class="detail-price-label">一口价</span>
              </template>
              <template v-else-if="isErrand && errandItem">
                <span class="detail-price">¥{{ errandItem.reward }}</span>
                <span class="detail-price-label">酬劳</span>
              </template>
              <template v-else-if="isGroupBuy && groupBuyItem">
                <span class="detail-progress">{{ groupBuyItem.currentCount }}/{{ groupBuyItem.targetCount }} 人已参与</span>
              </template>
            </div>
          </div>

          <div class="detail-tags">
            <el-tag v-if="isTrade" size="small">{{ tradeItem?.category }}</el-tag>
            <el-tag v-if="isTrade" size="small" effect="plain">{{ tradeItem?.campus }}</el-tag>
            <el-tag v-if="isLostFound" :type="lostFoundItem?.type === 'lost' ? 'danger' : 'success'" size="small">
              {{ lostFoundItem?.type === 'lost' ? '寻物启事' : '失物招领' }}
            </el-tag>
            <el-tag v-if="isGroupBuy" size="small">{{ groupBuyItem?.type }}</el-tag>
            <el-tag v-if="isErrand" size="small">{{ errandItem?.taskType }}</el-tag>
            <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small" effect="plain">
              {{ statusLabels[item.status] || item.status }}
            </el-tag>
          </div>

          <div class="detail-publisher">
            <div class="pub-avatar">{{ (item.publisher || '?').charAt(0) }}</div>
            <div class="pub-info">
              <span class="pub-name">{{ item.publisher }}</span>
              <span class="pub-label">发布者</span>
            </div>
          </div>

          <div class="detail-meta">
            <div class="meta-row">
              <span v-if="isTrade && tradeItem" class="meta-item">📍 {{ tradeItem.location }}</span>
              <span v-else-if="isLostFound && lostFoundItem" class="meta-item">📍 {{ lostFoundItem.location }}</span>
              <span v-else-if="isGroupBuy && groupBuyItem" class="meta-item">📍 {{ groupBuyItem.location }}</span>
              <span v-if="isErrand && errandItem" class="meta-item">📍 {{ errandItem.from }} → {{ errandItem.to }}</span>
            </div>
            <div class="meta-row">
              <span v-if="isTrade" class="meta-item">🕒 {{ tradeItem?.publishTime }}</span>
              <span v-if="isLostFound" class="meta-item">🕒 {{ lostFoundItem?.eventTime }}</span>
              <span v-if="isGroupBuy" class="meta-item">⏳ 截止 {{ groupBuyItem?.deadline }}</span>
              <span v-if="isErrand" class="meta-item">⏳ 截止 {{ errandItem?.deadline }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-card class="desc-card" shadow="never">
        <h3 class="desc-heading">商品详情</h3>
        <p class="desc-text">{{ item.description }}</p>
        <el-divider />
        <div class="desc-grid">
          <div v-if="isTrade && tradeItem" class="desc-field">
            <span class="field-label">成色</span>
            <span class="field-value">{{ tradeItem.condition }}</span>
          </div>
          <div v-if="isLostFound && lostFoundItem" class="desc-field">
            <span class="field-label">物品</span>
            <span class="field-value">{{ lostFoundItem.itemName }}</span>
          </div>
          <div v-if="isLostFound && lostFoundItem" class="desc-field">
            <span class="field-label">联系方式</span>
            <span class="field-value">{{ lostFoundItem.contact }}</span>
          </div>
          <div v-if="isGroupBuy && groupBuyItem" class="desc-field">
            <span class="field-label">进度</span>
            <span class="field-value">{{ groupBuyItem.currentCount }}/{{ groupBuyItem.targetCount }}</span>
          </div>
          <div v-if="isErrand && errandItem" class="desc-field">
            <span class="field-label">取件地</span>
            <span class="field-value">{{ errandItem.from }}</span>
          </div>
          <div v-if="isErrand && errandItem" class="desc-field">
            <span class="field-label">送达地</span>
            <span class="field-value">{{ errandItem.to }}</span>
          </div>
        </div>
      </el-card>

      <div class="detail-actions-bar">
        <div class="bar-left">
          <span class="bar-price">
            <template v-if="isTrade && tradeItem">¥{{ tradeItem.price }}</template>
            <template v-else-if="isErrand && errandItem">¥{{ errandItem.reward }} 酬劳</template>
            <template v-else-if="isGroupBuy && groupBuyItem">{{ groupBuyItem.currentCount }}/{{ groupBuyItem.targetCount }} 人</template>
          </span>
          <span class="bar-id">#{{ item.id }}</span>
        </div>
        <div class="bar-right">
          <el-button
            :type="isFavorited ? 'danger' : 'default'"
            @click="handleToggleFavorite"
            round
            size="default"
          >
            <svg v-if="isFavorited" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:4px;vertical-align:-2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:-2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            收藏
          </el-button>
          <el-button type="primary" round size="default" @click="handleContact">
            联系卖家
          </el-button>
          <el-button v-if="isTrade" round size="default" @click="openBargain">
            砍价
          </el-button>
          <el-button v-if="isGroupBuy && groupBuyItem && groupBuyItem.currentCount < groupBuyItem.targetCount && groupBuyItem.status === 'open'"
            type="success" round size="default" @click="handleJoinGroupBuy">
            我要参与
          </el-button>
          <el-button v-if="isErrand && errandItem && errandItem.status === 'open'"
            type="warning" round size="default" @click="handleAcceptErrand">
            我要接单
          </el-button>
          <el-button type="danger" text :disabled="deleting" @click="handleDelete">
            {{ deleting ? '删除中...' : '删除' }}
          </el-button>
        </div>
      </div>
    </template>

    <el-dialog v-model="bargainVisible" title="砍价" width="400px" align-center top="30vh">
      <div class="bargain-body">
        <p class="bargain-original">原价 <strong>¥{{ tradeItem?.price }}</strong></p>
        <el-slider
          v-model="bargainPrice"
          :min="Math.round((tradeItem?.price ?? 100) * 0.3)"
          :max="tradeItem?.price ?? 100"
          show-input
          :format-tooltip="(v: number) => `¥${v}`"
        />
        <p class="bargain-offer">你的出价 <strong>¥{{ bargainPrice }}</strong></p>
      </div>
      <template #footer>
        <el-button @click="bargainVisible = false">取消</el-button>
        <el-button type="danger" @click="handleBargain">发送砍价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.detail-page { max-width: 960px; margin: 0 auto; padding-bottom: 80px; }
.breadcrumb { margin-bottom: 16px; font-size: 13px; }

.detail-content {
  display: flex;
  gap: 28px;
  margin-bottom: 20px;
}

.detail-image-col {
  flex: 0 0 380px;
}

.detail-image-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg, 12px);
  background: #f3f4f6;
  overflow: hidden;
  border: 1px solid var(--border-color, #e5e7eb);
}

.detail-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 56px;
  opacity: 0.4;
}

.detail-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary, #111827);
  margin: 0;
  line-height: 1.35;
}

.detail-price-bar {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff5f0, #fff0eb);
  border-radius: var(--radius-md, 8px);
}

.detail-price {
  font-size: 30px;
  font-weight: 700;
  color: var(--color-price, #ff6b3d);
}

.detail-price-label {
  font-size: 13px;
  color: #9ca3af;
}

.detail-progress {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary, #2563eb);
}

.detail-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-publisher {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-input, #f9fafb);
  border-radius: var(--radius-md, 8px);
}

.pub-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-light, #eff6ff);
  color: var(--color-primary, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.pub-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pub-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.pub-label {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-row {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.desc-card {
  border-radius: var(--radius-lg, 12px);
}

.desc-heading {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0 0 12px;
}

.desc-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-primary, #374151);
  margin: 0;
  white-space: pre-wrap;
}

.desc-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.desc-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}

.field-value {
  font-size: 14px;
  color: var(--text-primary, #374151);
  font-weight: 500;
}

.detail-actions-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: var(--bg-card, #fff);
  border-top: 1px solid var(--border-color, #e5e7eb);
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
}

.bar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.bar-price {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-price, #ff6b3d);
}

.bar-id {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}

.bar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bargain-body {
  padding: 8px 0;
}

.bargain-original {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 20px;
}

.bargain-offer {
  font-size: 18px;
  color: var(--color-price, #ff6b3d);
  margin: 16px 0 0;
  font-weight: 700;
}

@media (max-width: 768px) {
  .detail-content {
    flex-direction: column;
  }
  .detail-image-col {
    flex: none;
  }
  .detail-image-wrap {
    max-height: 300px;
  }
  .detail-actions-bar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
  }
  .bar-right {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
