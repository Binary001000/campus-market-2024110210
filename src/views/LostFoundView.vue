<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>丢失物品别着急，拾获物品等失主，互助让校园更温暖。</p>
    </div>

    <div v-if="loading" class="loading-wrap">加载中...</div>

    <div v-else-if="error" class="error-wrap">加载失败，请检查 Mock 服务是否正常运行</div>

    <div v-else-if="lostFounds.length" class="list">
      <ItemCard
        v-for="item in lostFounds"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type === 'lost' ? '丢失' : '拾获'"
        :location="item.location"
        :time="item.eventTime"
      >
        <template #footer>
          <span class="item-name">物品：{{ item.itemName }}</span>
          <span class="status" :class="item.status">{{ item.status === 'open' ? '进行中' : item.status === 'closed' ? '已关闭' : '已完成' }}</span>
        </template>
      </ItemCard>
    </div>

    <EmptyState v-else text="暂无失物招领信息" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'

const lostFounds = ref<LostFoundItem[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.item-name {
  color: #374151;
}

.status {
  margin-left: 12px;
  font-size: 13px;
}

.status.open {
  color: #22c55e;
}

.status.closed {
  color: #9ca3af;
}

.status.done {
  color: #4a90d9;
}

.loading-wrap,
.error-wrap {
  text-align: center;
  padding: 48px;
  color: #9ca3af;
}

.error-wrap {
  color: #ef4444;
}
</style>
