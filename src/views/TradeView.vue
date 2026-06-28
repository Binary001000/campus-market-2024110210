<script setup lang="ts">
const items = [
  { id: 1, title: '《数据结构》教材 9成新', price: 25, condition: '九成新', campus: '北校区', seller: '张同学', time: '10 分钟前', desc: '几乎全新，仅有少量笔记，适合计算机专业' },
  { id: 2, title: '机械键盘 Cherry 青轴', price: 180, condition: '七成新', campus: '南校区', seller: '李同学', time: '25 分钟前', desc: '87键，使用半年，手感很好，配件齐全' },
  { id: 3, title: '台灯 LED 护眼', price: 35, condition: '九成新', campus: '北校区', seller: '王同学', time: '1 小时前', desc: '三档亮度可调，无频闪，宿舍学习必备' },
  { id: 7, title: '蓝牙耳机 降噪版', price: 120, condition: '八成新', campus: '北校区', seller: '周同学', time: '5 小时前', desc: '主动降噪，续航30小时，音质出色' },
  { id: 4, title: '四级词汇书（赠笔记）', price: 15, condition: '七成新', campus: '东校区', seller: '赵同学', time: '2 小时前', desc: '已过四级，赠送详细复习笔记' },
  { id: 5, title: 'iPad 保护壳 全新', price: 28, condition: '全新', campus: '西校区', seller: '陈同学', time: '3 小时前', desc: 'iPad Pro 11寸，买错型号未拆封' },
]
</script>

<template>
  <div class="page">
    <h1>二手交易</h1>
    <p class="page-desc">校园闲置物品买卖，让好物继续发光</p>

    <div class="card-grid">
      <RouterLink v-for="item in items" :key="item.id" :to="`/detail/${item.id}`" class="card">
        <div class="card-thumb">📦</div>
        <div class="card-body">
          <div class="card-title">{{ item.title }}</div>
          <p class="card-desc">{{ item.desc }}</p>
          <div class="card-meta">
            <span class="tag">{{ item.condition }}</span>
            <span class="tag">{{ item.campus }}</span>
            <span class="card-seller">{{ item.seller }}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">¥{{ item.price }}</span>
            <span class="card-time">{{ item.time }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 900px; }
.page-desc { color: #6b7280; margin-bottom: 20px; }

.card-grid { display: flex; flex-direction: column; gap: 12px; }
.card {
  display: flex; gap: 16px; padding: 16px; background: #fff;
  border: 1px solid #e5e7eb; border-radius: 10px; text-decoration: none; color: inherit;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

.card-thumb { width: 80px; height: 80px; background: #f3f4f6; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 32px; flex-shrink: 0; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.card-desc { font-size: 13px; color: #6b7280; margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.tag { font-size: 12px; background: #f0f5ff; color: #4a90d9; padding: 2px 8px; border-radius: 4px; }
.card-seller { font-size: 12px; color: #9ca3af; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-price { font-size: 20px; font-weight: 700; color: #ff6b3d; }
.card-time { font-size: 12px; color: #c0c4cc; }
</style>
