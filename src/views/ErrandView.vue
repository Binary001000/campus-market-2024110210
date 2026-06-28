<script setup lang="ts">
const items = [
  { id: 301, title: '代取快递 📦', desc: '菜鸟驿站，3个包裹，需要小推车', reward: 8, location: '菜鸟驿站', deadline: '今天 18:00', campus: '北校区', poster: '张同学' },
  { id: 302, title: '代买晚餐 🍜', desc: '东门小吃街，一份麻辣烫+一杯奶茶', reward: 10, location: '东门小吃街', deadline: '今天 19:00', campus: '南校区', poster: '王同学' },
  { id: 303, title: '代送文件 📄', desc: '送到行政楼教务处，一份申请表', reward: 5, location: '行政楼', deadline: '明天 10:00', campus: '北校区', poster: '李同学' },
  { id: 304, title: '代排队 🎫', desc: '体育馆门口排队买活动票，约1小时', reward: 15, location: '体育馆', deadline: '周六 08:00', campus: '东校区', poster: '刘同学' },
  { id: 305, title: '代办校园卡业务 🏫', desc: '去信息中心补办校园卡，取号排队', reward: 8, location: '信息中心', deadline: '周五 16:00', campus: '西校区', poster: '陈同学' },
]
</script>

<template>
  <div class="page">
    <h1>跑腿委托</h1>
    <p class="page-desc">找人帮忙跑个腿，省时省力，互帮互助</p>

    <div class="card-grid">
      <div v-for="item in items" :key="item.id" class="card">
        <div class="card-left">
          <div class="card-icon">{{ item.title.slice(0, 2) }}</div>
        </div>
        <div class="card-body">
          <div class="card-title">{{ item.title }}</div>
          <p class="card-desc">{{ item.desc }}</p>
          <div class="card-meta">
            <span>📍 {{ item.location }}</span>
            <span>⏰ {{ item.deadline }}</span>
            <span>🏫 {{ item.campus }}</span>
          </div>
          <div class="card-footer">
            <span class="card-poster">👤 {{ item.poster }}</span>
            <span class="card-reward">💰 酬劳 ¥{{ item.reward }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 800px; }
.page-desc { color: #6b7280; margin-bottom: 20px; }

.card-grid { display: flex; flex-direction: column; gap: 12px; }
.card { display: flex; gap: 16px; padding: 16px; background: #fff;
  border: 1px solid #e5e7eb; border-radius: 10px; }
.card-left { flex-shrink: 0; }
.card-icon { width: 56px; height: 56px; background: #fef3c7; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; color: #92400e; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.card-desc { font-size: 14px; color: #6b7280; margin: 0 0 8px; }
.card-meta { display: flex; gap: 16px; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-poster { font-size: 13px; color: #6b7280; }
.card-reward { font-size: 16px; font-weight: 700; color: #f59e0b; }
</style>
