<script setup lang="ts">
const items = [
  { id: 201, title: '奶茶拼单 🧋', desc: '凑够4人一起点，满减更划算', current: 3, target: 4, deadline: '今天 18:00', campus: '北校区', initiator: '刘同学' },
  { id: 202, title: '考研搭子 📚', desc: '每天图书馆互相监督，坚持到考研', current: 2, target: 4, deadline: '2026-07-05', campus: '南校区', initiator: '王同学' },
  { id: 203, title: '水果团购 🍊', desc: '拼团买当季水果，批发价更实惠', current: 5, target: 10, deadline: '明天 12:00', campus: '北校区', initiator: '陈同学' },
  { id: 204, title: '夜跑搭子 🏃', desc: '每天晚上9点操场跑步，互相督促', current: 3, target: 6, deadline: '长期有效', campus: '东校区', initiator: '赵同学' },
  { id: 205, title: '外卖拼单 🍕', desc: '周末一起点大份套餐，AA更实惠', current: 2, target: 4, deadline: '周六 11:00', campus: '西校区', initiator: '李同学' },
]
</script>

<template>
  <div class="page">
    <h1>拼单搭子</h1>
    <p class="page-desc">找人一起拼，一起学，一起运动，校园生活更精彩</p>

    <div class="card-grid">
      <div v-for="item in items" :key="item.id" class="card">
        <div class="card-header">
          <span class="card-title">{{ item.title }}</span>
          <span class="card-people">{{ item.current }}/{{ item.target }} 人</span>
        </div>
        <p class="card-desc">{{ item.desc }}</p>
        <div class="card-meta">
          <span>⏰ {{ item.deadline }}</span>
          <span>🏫 {{ item.campus }}</span>
          <span>👤 {{ item.initiator }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (item.current / item.target * 100) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 800px; }
.page-desc { color: #6b7280; margin-bottom: 20px; }

.card-grid { display: flex; flex-direction: column; gap: 12px; }
.card { padding: 18px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.card-title { font-size: 16px; font-weight: 600; }
.card-people { font-size: 14px; font-weight: 600; color: #4a90d9; }
.card-desc { font-size: 14px; color: #6b7280; margin: 0 0 10px; }
.card-meta { display: flex; gap: 16px; font-size: 13px; color: #6b7280; margin-bottom: 10px; }
.progress-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: #4a90d9; border-radius: 3px; transition: width 0.4s; }
</style>
