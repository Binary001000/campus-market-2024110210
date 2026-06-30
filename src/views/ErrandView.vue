<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
      <p>找人帮忙跑个腿，省时省力，互帮互助。</p>
    </div>

    <div v-if="loading" class="loading-wrap">加载中...</div>

    <div v-else-if="error" class="error-wrap">加载失败，请检查 Mock 服务是否正常运行</div>

    <div v-else-if="errands.length" class="list">
      <ItemCard
        v-for="item in errands"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
      >
        <template #footer>
          <strong>💰 酬劳 ¥{{ item.reward }}</strong>
          <span class="publisher">{{ item.publisher }}</span>
        </template>
      </ItemCard>
    </div>

    <EmptyState v-else text="暂无跑腿委托信息" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getErrands, type ErrandItem } from '../api/errand'

const errands = ref<ErrandItem[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await getErrands()
    errands.value = res.data
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

.publisher {
  margin-left: 12px;
  color: #6b7280;
  font-size: 13px;
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
