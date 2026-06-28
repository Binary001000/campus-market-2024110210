<script setup lang="ts">
interface ListItem {
  id: number
  title: string
  price: number
  category: string
  time: string
}

const items: ListItem[] = [
  { id: 1, title: '《数据结构》教材 9成新', price: 25, category: '教材教辅', time: '10 分钟前' },
  { id: 2, title: '机械键盘 Cherry 青轴', price: 180, category: '电子产品', time: '25 分钟前' },
  { id: 3, title: '台灯 LED 护眼', price: 35, category: '生活用品', time: '1 小时前' },
  { id: 4, title: '四级词汇书（赠笔记）', price: 15, category: '教材教辅', time: '2 小时前' },
  { id: 5, title: 'iPad 保护壳 全新', price: 28, category: '电子产品', time: '3 小时前' },
  { id: 6, title: '瑜伽垫 加厚防滑', price: 45, category: '运动户外', time: '4 小时前' },
  { id: 7, title: '蓝牙耳机 降噪版', price: 120, category: '电子产品', time: '5 小时前' },
  { id: 8, title: '考研英语真题集', price: 20, category: '教材教辅', time: '6 小时前' },
]
</script>

<template>
  <div class="list-page">
    <h2>商品列表</h2>
    <div class="list-grid">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="list-card"
      >
        <div class="card-title">{{ item.title }}</div>
        <div class="card-meta">
          <span class="card-category">{{ item.category }}</span>
          <span class="card-time">{{ item.time }}</span>
        </div>
        <div class="card-price">¥{{ item.price }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  max-width: 800px;
}

.list-grid {
  display: grid;
  gap: 12px;
}

.list-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s;
}

.list-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 15px;
  font-weight: 500;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.card-category {
  background: #f0f5ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
}
</style>
