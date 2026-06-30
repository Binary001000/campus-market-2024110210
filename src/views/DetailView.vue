<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTradeById, deleteTrade, type TradeItem } from '../api/trade'

const route = useRoute()
const router = useRouter()
const itemId = Number(route.params.id)

const item = ref<TradeItem | null>(null)
const loading = ref(true)
const deleting = ref(false)
const isFavorited = ref(false)

onMounted(async () => {
  try {
    const res = await getTradeById(itemId)
    item.value = res.data
  } catch (e) {
    console.error('获取详情失败', e)
  } finally {
    loading.value = false
  }
})

const handleDelete = async () => {
  if (!confirm('确定删除该商品？此操作不可撤销。')) return
  deleting.value = true
  try {
    await deleteTrade(itemId)
    window.alert('删除成功')
    router.push('/list')
  } catch (e) {
    console.error('删除失败', e)
    window.alert('删除失败，请检查 Mock 服务')
  } finally {
    deleting.value = false
  }
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
}

const statusLabels: Record<string, string> = { open: '进行中', closed: '已关闭', done: '已完成' }
</script>

<template>
  <div class="detail-page">
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/list' }">二手集市</el-breadcrumb-item>
      <el-breadcrumb-item>{{ item?.title || '商品详情' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-wrap">
      <p>加载中...</p>
    </div>

    <!-- 不存在 -->
    <el-result
      v-else-if="!item"
      icon="warning"
      title="商品不存在"
      sub-title="该商品可能已下架或删除"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/list')">返回二手集市</el-button>
      </template>
    </el-result>

    <!-- 详情 -->
    <template v-else>
      <el-card class="main-card">
        <div class="main-layout">
          <div class="main-thumb">
            <img v-if="item.image" :src="item.image" alt="" class="thumb-img" />
            <span v-else class="thumb-icon">📷</span>
          </div>
          <div class="main-info">
            <h2 class="info-title">{{ item.title }}</h2>
            <div class="info-price-row">
              <span class="info-price">¥{{ item.price }}</span>
            </div>
            <div class="info-tags">
              <el-tag size="small">{{ item.category }}</el-tag>
              <el-tag type="info" size="small" effect="plain">{{ item.campus }}</el-tag>
              <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small" effect="plain">
                {{ statusLabels[item.status] || item.status }}
              </el-tag>
            </div>
            <div class="info-publisher">
              <div class="pub-avatar">👤</div>
              <div class="pub-detail">
                <span class="pub-name">{{ item.publisher }}</span>
              </div>
            </div>
            <div class="info-extra">
              <span>📍 {{ item.location }}</span>
              <span>🕒 {{ item.publishTime }}</span>
            </div>
            <div class="info-actions">
              <el-button
                :type="isFavorited ? 'danger' : 'default'"
                @click="toggleFavorite"
                round
              >
                {{ isFavorited ? '已收藏' : '收藏' }}
              </el-button>
              <el-button type="primary" round>
                联系卖家
              </el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="desc-section">
          <h3>商品描述</h3>
          <p class="desc-text">{{ item.description }}</p>
          <div class="desc-meta">
            <div class="meta-item">
              <span class="meta-label">交易地点</span>
              <span class="meta-value">📍 {{ item.location }}</span>
            </div>
            <div class="meta-item" v-if="item.condition">
              <span class="meta-label">成色</span>
              <span class="meta-value">{{ item.condition }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">校区</span>
              <span class="meta-value">{{ item.campus }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <div class="item-id">
        商品编号：#{{ item.id }}
        <el-button type="danger" size="small" text :disabled="deleting" @click="handleDelete" style="margin-left: 16px">
          {{ deleting ? '删除中...' : '删除' }}
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page { max-width: 800px; }
.breadcrumb { margin-bottom: 16px; font-size: 13px; }
.loading-wrap { text-align: center; padding: 48px; color: #9ca3af; }

.main-card { border-radius: 12px; margin-bottom: 16px; }
.main-layout { display: flex; gap: 24px; }
.main-thumb { width: 320px; height: 240px; border-radius: 12px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-icon { font-size: 48px; opacity: 0.35; }
.main-info { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.info-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; line-height: 1.3; }
.info-price-row { display: flex; align-items: baseline; gap: 10px; }
.info-price { font-size: 32px; font-weight: 700; color: #ff6b3d; }
.info-tags { display: flex; gap: 6px; }
.info-publisher { display: flex; align-items: center; gap: 10px; }
.pub-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.pub-detail { display: flex; flex-direction: column; }
.pub-name { font-size: 14px; font-weight: 500; color: #374151; }
.info-extra { display: flex; gap: 16px; font-size: 12px; color: #9ca3af; }
.info-actions { display: flex; gap: 10px; margin-top: 4px; }
.desc-section h3 { font-size: 16px; font-weight: 600; margin: 0 0 10px; color: #1a1a2e; }
.desc-text { font-size: 14px; line-height: 1.8; color: #374151; margin: 0 0 16px; }
.desc-meta { display: flex; gap: 32px; }
.meta-item { display: flex; gap: 8px; align-items: center; }
.meta-label { font-size: 13px; color: #9ca3af; }
.meta-value { font-size: 14px; color: #374151; }
.item-id { text-align: center; font-size: 12px; color: #c0c4cc; margin-top: 8px; padding-bottom: 32px; }
</style>
