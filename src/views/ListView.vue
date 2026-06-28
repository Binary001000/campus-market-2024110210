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

const categoryType = (cat: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '教材教辅': '',
    '电子产品': 'success',
    '生活用品': 'warning',
    '运动户外': 'danger',
    '服饰美妆': 'info',
  }
  return map[cat] || ''
}
</script>

<template>
  <div class="list-page">
    <h2>商品列表</h2>
    <div class="list-grid">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="card-link"
      >
        <el-card shadow="hover" class="item-card">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-meta">
            <el-tag :type="categoryType(item.category)" size="small">{{ item.category }}</el-tag>
            <span class="card-time">{{ item.time }}</span>
          </div>
          <div class="card-price">¥{{ item.price }}</div>
        </el-card>
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

.card-link {
  text-decoration: none;
  color: inherit;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-time {
  font-size: 12px;
  color: #c0c4cc;
}

.card-price {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
}
</style>
