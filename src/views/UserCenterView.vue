<script setup lang="ts">
import { ref } from 'vue'

const user = {
  nickname: '校园用户',
  college: '计算机学院',
  campus: '北校区',
  role: '学生',
  creditScore: 100,
}

const activeTab = ref('publishes')

const myPublishes = [
  { id: 1, title: '《数据结构》教材 9成新', type: '二手交易', status: '进行中', time: '2026-06-28' },
  { id: 3, title: '台灯 LED 护眼', type: '二手交易', status: '已完成', time: '2026-06-27' },
]

const myFavorites = [
  { id: 2, title: '机械键盘 Cherry 青轴', type: '二手交易', price: 180, time: '2026-06-27' },
  { id: 7, title: '蓝牙耳机 降噪版', type: '二手交易', price: 120, time: '2026-06-25' },
  { id: 4, title: '四级词汇书（赠笔记）', type: '二手交易', price: 15, time: '2026-06-26' },
  { id: 5, title: 'iPad 保护壳 全新', type: '二手交易', price: 28, time: '2026-06-26' },
]
</script>

<template>
  <div class="page">
    <h1>个人中心</h1>

    <!-- 用户资料 -->
    <div class="user-card">
      <div class="user-avatar">👤</div>
      <div class="user-info">
        <div class="user-name">{{ user.nickname }}</div>
        <div class="user-tags">
          <span class="utag">{{ user.college }}</span>
          <span class="utag">{{ user.campus }}</span>
          <span class="utag">{{ user.role }}</span>
        </div>
      </div>
      <div class="user-credit">
        <div class="credit-num">{{ user.creditScore }}</div>
        <div class="credit-label">信用分</div>
      </div>
    </div>

    <!-- 数据行 -->
    <div class="stat-row">
      <div class="stat-item">
        <div class="stat-num">2</div><div class="stat-label">我的发布</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">4</div><div class="stat-label">我的收藏</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">3</div><div class="stat-label">未读消息</div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'publishes' }" @click="activeTab = 'publishes'">我的发布</button>
      <button :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">我的收藏</button>
    </div>

    <!-- 我的发布 -->
    <div v-if="activeTab === 'publishes'" class="list">
      <div v-for="item in myPublishes" :key="item.id" class="list-item">
        <a :href="`/detail/${item.id}`" class="item-link" @click.prevent="$router.push(`/detail/${item.id}`)">{{ item.title }}</a>
        <div class="item-right">
          <span class="tag">{{ item.type }}</span>
          <span class="tag" :class="item.status === '进行中' ? 'active' : 'done'">{{ item.status }}</span>
          <span class="item-time">{{ item.time }}</span>
        </div>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div v-if="activeTab === 'favorites'" class="fav-grid">
      <div v-for="item in myFavorites" :key="item.id" class="fav-card">
        <a :href="`/detail/${item.id}`" class="fav-link" @click.prevent="$router.push(`/detail/${item.id}`)">
          <div class="fav-title">{{ item.title }}</div>
          <div class="fav-bottom">
            <span class="fav-price">¥{{ item.price }}</span>
            <span class="tag">{{ item.type }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 800px; }

/* 用户卡片 */
.user-card { display: flex; align-items: center; gap: 20px; padding: 24px;
  background: linear-gradient(135deg, #4a90d9, #6ba5e7); border-radius: 14px; margin-bottom: 16px; color: #fff; }
.user-avatar { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 32px; flex-shrink: 0; }
.user-info { flex: 1; }
.user-name { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
.user-tags { display: flex; gap: 6px; }
.utag { font-size: 12px; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 4px; }
.user-credit { text-align: center; }
.credit-num { font-size: 36px; font-weight: 700; line-height: 1; }
.credit-label { font-size: 12px; opacity: 0.75; margin-top: 4px; }

/* 数据行 */
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e5e7eb;
  border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
.stat-item { background: #fff; padding: 16px; text-align: center; }
.stat-num { font-size: 22px; font-weight: 700; }
.stat-label { font-size: 12px; color: #9ca3af; margin-top: 2px; }

/* 标签切换 */
.tabs { display: flex; gap: 0; margin-bottom: 16px; background: #f3f4f6; border-radius: 8px; padding: 4px; }
.tabs button { flex: 1; padding: 8px; border: none; background: transparent;
  border-radius: 6px; font-size: 14px; cursor: pointer; color: #6b7280; }
.tabs button.active { background: #fff; color: #4a90d9; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }

/* 列表 */
.list { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
.list-item:last-child { border-bottom: none; }
.item-link { font-size: 15px; font-weight: 500; color: #1a1a2e; text-decoration: none; }
.item-link:hover { color: #4a90d9; }
.item-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.tag { font-size: 12px; background: #f0f5ff; color: #4a90d9; padding: 2px 8px; border-radius: 4px; }
.tag.active { background: #f0fdf4; color: #22c55e; }
.tag.done { background: #f3f4f6; color: #9ca3af; }
.item-time { font-size: 12px; color: #c0c4cc; }

/* 收藏网格 */
.fav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.fav-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; }
.fav-link { text-decoration: none; color: inherit; }
.fav-title { font-size: 14px; font-weight: 500; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fav-bottom { display: flex; justify-content: space-between; align-items: center; }
.fav-price { font-size: 18px; font-weight: 700; color: #ff6b3d; }
</style>
