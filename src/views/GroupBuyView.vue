<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>找人一起拼，一起学，一起运动，校园生活更精彩。</p>
    </div>

    <div v-if="groupBuys.length" class="list">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
      >
        <template #footer>
          <span>{{ item.currentCount }}/{{ item.targetCount }} 人</span>
          <span class="publisher">{{ item.publisher }}</span>
        </template>
      </ItemCard>
    </div>

    <EmptyState v-else text="暂无拼单搭子信息" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'

const groupBuys = ref<GroupBuyItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
  groupBuys.value = res.data
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
</style>
