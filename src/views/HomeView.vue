<script setup lang="ts">
interface EntryCard {
  type: string
  label: string
  icon: string
  desc: string
  color: string
}

const entries: EntryCard[] = [
  { type: 'secondhand', label: '二手交易', icon: '🛒', desc: '闲置物品买卖', color: '#1890ff' },
  { type: 'lostfound', label: '失物招领', icon: '🔍', desc: '丢失 & 拾获互助', color: '#52c41a' },
  { type: 'group', label: '拼单搭子', icon: '👥', desc: '拼单 & 找搭子', color: '#faad14' },
  { type: 'errand', label: '跑腿委托', icon: '🏃', desc: '代取快递 & 代办事务', color: '#eb2f96' },
]

const latestItems = [
  { id: 1, title: '《数据结构》教材 9成新', price: 25, type: '二手交易', time: '10 分钟前' },
  { id: 2, title: '机械键盘 Cherry 青轴', price: 180, type: '二手交易', time: '25 分钟前' },
  { id: 3, title: '台灯 LED 护眼', price: 35, type: '二手交易', time: '1 小时前' },
  { id: 7, title: '蓝牙耳机 降噪版', price: 120, type: '二手交易', time: '5 小时前' },
]
</script>

<template>
  <div class="home">
    <!-- 欢迎区 -->
    <div class="welcome">
      <h2>👋 欢迎来到校园轻集市</h2>
      <p>一站式校园信息平台，发现你需要的校园服务</p>
    </div>

    <!-- 四类业务入口 -->
    <el-row :gutter="16" class="entry-row">
      <el-col v-for="e in entries" :key="e.type" :span="6">
        <RouterLink :to="`/list`" class="entry-card-link">
          <el-card shadow="hover" class="entry-card">
            <div class="entry-icon">{{ e.icon }}</div>
            <div class="entry-label">{{ e.label }}</div>
            <div class="entry-desc">{{ e.desc }}</div>
          </el-card>
        </RouterLink>
      </el-col>
    </el-row>

    <!-- 统计 + 最新 -->
    <el-row :gutter="16">
      <!-- 我的数据 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stat-panel">
          <template #header><span>📊 我的数据</span></template>
          <div class="stat-item">
            <span class="stat-num">0</span>
            <span class="stat-text">我的收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">0</span>
            <span class="stat-text">未读消息</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">0</span>
            <span class="stat-text">我的发布</span>
          </div>
        </el-card>
      </el-col>

      <!-- 最新发布 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="panel-header">
              <span>📋 最新发布</span>
              <RouterLink to="/list" class="more-link">查看更多 →</RouterLink>
            </div>
          </template>
          <div v-for="item in latestItems" :key="item.id" class="latest-item">
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
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="16" class="quick-row">
      <el-col :span="8" v-for="link in [
        { to: '/publish', label: '发布信息', icon: '📝' },
        { to: '/message', label: '消息中心', icon: '💬' },
        { to: '/board', label: '数据看板', icon: '📊' },
      ]" :key="link.to">
        <RouterLink :to="link.to" class="quick-link">
          <el-button size="large" class="quick-btn">
            {{ link.icon }} {{ link.label }}
          </el-button>
        </RouterLink>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home {
  max-width: 1080px;
}

.welcome {
  margin-bottom: 24px;
}

.welcome h2 {
  margin: 0 0 4px;
  font-size: 22px;
}

.welcome p {
  color: #909399;
  margin: 0;
}

/* 业务入口 */
.entry-row {
  margin-bottom: 16px;
}

.entry-card-link {
  text-decoration: none;
}

.entry-card {
  text-align: center;
  cursor: pointer;
}

.entry-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.entry-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.entry-desc {
  font-size: 12px;
  color: #909399;
}

/* 统计面板 */
.stat-panel .stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f2f2f2;
}

.stat-panel .stat-item:last-child {
  border-bottom: none;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.stat-text {
  font-size: 14px;
  color: #909399;
}

/* 最新发布 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-link {
  font-size: 13px;
  color: #1890ff;
  text-decoration: none;
}

.latest-item {
  border-bottom: 1px solid #f2f2f2;
}

.latest-item:last-child {
  border-bottom: none;
}

.latest-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  text-decoration: none;
  color: inherit;
}

.latest-title {
  flex: 1;
  font-size: 14px;
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
  color: #f56c6c;
  flex-shrink: 0;
}

/* 快捷入口 */
.quick-row {
  margin-top: 16px;
}

.quick-link {
  text-decoration: none;
  display: block;
}

.quick-btn {
  width: 100%;
  height: 56px;
  font-size: 15px;
}
</style>
