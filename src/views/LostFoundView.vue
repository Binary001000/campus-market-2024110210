<script setup lang="ts">
const items = [
  { id: 101, title: '校园卡 张同学', type: '丢失', location: '图书馆二楼', feature: '蓝色卡套，有姓名贴纸', time: '今天 09:30', campus: '北校区' },
  { id: 102, title: '黑色双肩包', type: '丢失', location: '食堂一楼', feature: '品牌：Jansport，内有教材和笔袋', time: '昨天 12:15', campus: '南校区' },
  { id: 103, title: 'AirPods 充电盒', type: '拾获', location: '教学楼A座302', feature: '白色，有保护壳', time: '今天 08:00', campus: '北校区' },
  { id: 104, title: '钥匙串', type: '拾获', location: '操场跑道旁', feature: '三把钥匙+哆啦A梦挂件', time: '2 小时前', campus: '东校区' },
  { id: 105, title: '校园卡 李同学', type: '拾获', location: '快递站门口', feature: '计算机学院，学号后四位3821', time: '昨天 17:00', campus: '西校区' },
  { id: 106, title: '雨伞 深蓝色', type: '丢失', location: '宿舍3号楼大厅', feature: '自动折叠伞，伞柄有白色划痕', time: '3 小时前', campus: '北校区' },
]
</script>

<template>
  <div class="page">
    <h1>失物招领</h1>
    <p class="page-desc">丢失物品别着急，拾获物品等失主，互助让校园更温暖</p>

    <div class="card-grid">
      <div v-for="item in items" :key="item.id" class="card">
        <div class="card-badge" :class="item.type === '丢失' ? 'lost' : 'found'">
          {{ item.type === '丢失' ? '🔴 丢失' : '🟢 拾获' }}
        </div>
        <div class="card-body">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-meta">
            <span>📍 {{ item.location }}</span>
            <span>🏫 {{ item.campus }}</span>
          </div>
          <div class="card-feature">🔍 {{ item.feature }}</div>
          <div class="card-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 800px; }
.page-desc { color: #6b7280; margin-bottom: 20px; }

.card-grid { display: flex; flex-direction: column; gap: 12px; }
.card {
  display: flex; gap: 16px; padding: 16px; background: #fff;
  border: 1px solid #e5e7eb; border-radius: 10px;
}
.card-badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; height: fit-content; flex-shrink: 0; }
.card-badge.lost { background: #fef2f2; color: #ef4444; }
.card-badge.found { background: #f0fdf4; color: #22c55e; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.card-meta { display: flex; gap: 16px; font-size: 13px; color: #6b7280; margin-bottom: 4px; }
.card-feature { font-size: 14px; color: #374151; margin-bottom: 4px; }
.card-time { font-size: 12px; color: #c0c4cc; }
</style>
