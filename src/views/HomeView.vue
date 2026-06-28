<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const entries = [
  { type: 'secondhand', label: '二手交易', icon: '🛒', desc: '闲置物品买卖' },
  { type: 'lostfound', label: '失物招领', icon: '🔍', desc: '丢失 & 拾获互助' },
  { type: 'group', label: '拼单搭子', icon: '👥', desc: '拼单 & 找搭子' },
  { type: 'errand', label: '跑腿委托', icon: '🏃', desc: '代取快递 & 代办事务' },
]

const stats = [
  { label: '在售商品', value: 326 },
  { label: '活跃用户', value: 1280 },
  { label: '今日新增', value: 47 },
]

const latestItems = [
  { id: 1, title: '《数据结构》教材 9成新', price: 25, type: '二手交易', time: '10 分钟前' },
  { id: 2, title: '机械键盘 Cherry 青轴', price: 180, type: '二手交易', time: '25 分钟前' },
  { id: 3, title: '台灯 LED 护眼', price: 35, type: '二手交易', time: '1 小时前' },
  { id: 7, title: '蓝牙耳机 降噪版', price: 120, type: '二手交易', time: '5 小时前' },
]

const hotItems = [
  { id: 1, title: '《数据结构》教材 9成新', price: 25, hot: '🔥 86人浏览' },
  { id: 2, title: '机械键盘 Cherry 青轴', price: 180, hot: '🔥 64人浏览' },
  { id: 7, title: '蓝牙耳机 降噪版', price: 120, hot: '🔥 51人浏览' },
  { id: 3, title: '台灯 LED 护眼', price: 35, hot: '🔥 38人浏览' },
]
</script>

<template>
  <div class="home">
    <!-- A. Hero Banner -->
    <section class="hero">
      <div class="hero-content">
        <h2 class="hero-title">今天想淘点什么？</h2>
        <p class="hero-subtitle">校园好物，触手可及</p>
        <div class="hero-search">
          <el-input
            size="large"
            placeholder="搜索二手教材、电子产品..."
            :prefix-icon="Search"
            class="hero-input"
          />
        </div>
      </div>
    </section>

    <!-- B. 四类业务入口 -->
    <section class="entry-section">
      <div class="entry-grid">
        <RouterLink
          v-for="e in entries"
          :key="e.type"
          :to="`/list`"
          class="entry-card"
        >
          <div class="entry-icon">{{ e.icon }}</div>
          <div class="entry-label">{{ e.label }}</div>
          <div class="entry-desc">{{ e.desc }}</div>
        </RouterLink>
      </div>
    </section>

    <!-- C. 三列统计 -->
    <section class="stat-section">
      <div class="stat-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card">
          <div class="stat-value">{{ s.value.toLocaleString() }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- D. 最新发布 + 热门推荐 -->
    <section class="feed-section">
      <div class="feed-main">
        <el-card shadow="hover" class="feed-card">
          <template #header>
            <div class="feed-header">
              <span class="feed-title">📋 最新发布</span>
              <RouterLink to="/list" class="feed-more">查看更多 →</RouterLink>
            </div>
          </template>
          <div v-for="item in latestItems" :key="item.id" class="latest-row">
            <RouterLink :to="`/detail/${item.id}`" class="latest-link">
              <span class="latest-title">{{ item.title }}</span>
              <span class="latest-meta">
                <el-tag size="small">{{ item.type }}</el-tag>
                <span class="latest-time">{{ item.time }}</span>
              </span>
              <span class="latest-price">¥{{ item.price }}</span>
            </RouterLink>
          </div>
        </el-card>
      </div>
      <div class="feed-side">
        <el-card shadow="hover" class="feed-card">
          <template #header>
            <span class="feed-title">🔥 热门推荐</span>
          </template>
          <div class="hot-grid">
            <RouterLink
              v-for="item in hotItems"
              :key="item.id"
              :to="`/detail/${item.id}`"
              class="hot-card"
            >
              <div class="hot-title">{{ item.title }}</div>
              <div class="hot-bottom">
                <span class="hot-price">¥{{ item.price }}</span>
                <span class="hot-meta">{{ item.hot }}</span>
              </div>
            </RouterLink>
          </div>
        </el-card>
      </div>
    </section>

    <!-- E. 底部快捷操作 -->
    <section class="quick-section">
      <RouterLink to="/publish" class="quick-link">
        <el-button type="primary" size="large" class="quick-btn">
          📝 发布信息
        </el-button>
      </RouterLink>
      <RouterLink to="/message" class="quick-link">
        <el-button size="large" class="quick-btn">💬 消息中心</el-button>
      </RouterLink>
      <RouterLink to="/board" class="quick-link">
        <el-button size="large" class="quick-btn">📊 数据看板</el-button>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1080px;
}

/* ===== A. Hero Banner ===== */
.hero {
  background: linear-gradient(135deg, #4a90d9 0%, #6ba5e7 100%);
  border-radius: 16px;
  padding: 40px 48px;
  margin-bottom: 24px;
  text-align: center;
}

.hero-title {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px;
}

.hero-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 24px;
}

.hero-search {
  max-width: 480px;
  margin: 0 auto;
}

.hero-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ===== B. 四类业务入口 ===== */
.entry-section {
  margin-bottom: 24px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.entry-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #4a90d9;
}

.entry-icon {
  font-size: 40px;
  margin-bottom: 10px;
  line-height: 1;
}

.entry-label {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 12px;
  color: #9ca3af;
}

/* ===== C. 三列统计 ===== */
.stat-section {
  margin-bottom: 24px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #f0f5ff;
  border: none;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #4a90d9;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* ===== D. 最新发布 + 热门推荐 ===== */
.feed-section {
  display: grid;
  grid-template-columns: 1fr 0.67fr;
  gap: 16px;
  margin-bottom: 24px;
}

.feed-card {
  height: 100%;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feed-title {
  font-size: 16px;
  font-weight: 600;
}

.feed-more {
  font-size: 13px;
  color: #4a90d9;
  text-decoration: none;
}

.feed-more:hover {
  text-decoration: underline;
}

.latest-row {
  border-bottom: 1px solid #f0f0f0;
}

.latest-row:last-child {
  border-bottom: none;
}

.latest-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  text-decoration: none;
  color: inherit;
}

.latest-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.latest-time {
  font-size: 12px;
  color: #c0c4cc;
}

.latest-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b3d;
  flex-shrink: 0;
}

/* 热门推荐 */
.hot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.hot-card {
  background: #fff9f0;
  border: 1px solid #fef0e5;
  border-radius: 8px;
  padding: 14px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.hot-card:hover {
  border-color: #ff6b3d;
  transform: translateY(-1px);
}

.hot-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hot-price {
  font-size: 15px;
  font-weight: 600;
  color: #ff6b3d;
}

.hot-meta {
  font-size: 11px;
  color: #9ca3af;
}

/* ===== E. 底部快捷操作 ===== */
.quick-section {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.quick-link {
  text-decoration: none;
}

.quick-btn {
  height: 48px;
  border-radius: 8px;
  font-size: 15px;
  padding: 0 32px;
}
</style>
