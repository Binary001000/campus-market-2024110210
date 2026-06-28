<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Right } from '@element-plus/icons-vue'

const user = {
  nickname: '校园用户',
  college: '计算机学院',
  campus: '北校区',
  role: '学生',
  creditScore: 100,
}

const statItems = [
  { label: '我的发布', value: 2 },
  { label: '我的收藏', value: 2 },
  { label: '浏览历史', value: 15 },
  { label: '未读消息', value: 3 },
]

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

const activeTab = ref('publishes')

const typeTagColor = (type: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '二手交易': '', '失物招领': 'warning', '拼单搭子': 'success', '跑腿委托': 'danger',
  }
  return map[type] || ''
}

const emitStatusUpdate = (itemId: number, newStatus: string) => {
  const item = myPublishes.find(i => i.id === itemId)
  if (item) item.status = newStatus
}
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">个人中心</h2>

    <!-- A. 顶部用户卡片 -->
    <div class="user-hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-avatar">👤</div>
        <div class="hero-info">
          <div class="hero-name">{{ user.nickname }}</div>
          <div class="hero-tags">
            <el-tag size="small" effect="dark" round>{{ user.college }}</el-tag>
            <el-tag size="small" effect="dark" round>{{ user.campus }}</el-tag>
            <el-tag size="small" effect="dark" round>{{ user.role }}</el-tag>
          </div>
        </div>
        <div class="hero-credit">
          <div class="credit-num">{{ user.creditScore }}</div>
          <div class="credit-text">信用分</div>
        </div>
        <el-button class="hero-edit" :icon="Edit" round size="small">编辑资料</el-button>
      </div>
    </div>

    <!-- B. 数据概览 -->
    <div class="stat-row">
      <div v-for="s in statItems" :key="s.label" class="stat-cell">
        <div class="stat-num">{{ s.value }}</div>
        <div class="stat-text">{{ s.label }}</div>
      </div>
    </div>

    <!-- C. 标签页区 -->
    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- 我的发布 -->
        <el-tab-pane label="我的发布" name="publishes">
          <div v-if="myPublishes.length">
            <div v-for="item in myPublishes" :key="item.id" class="tab-item">
              <div class="tab-item-left">
                <RouterLink :to="`/detail/${item.id}`" class="item-title-link">
                  {{ item.title }}
                </RouterLink>
                <div class="item-meta">
                  <el-tag :type="typeTagColor(item.type)" size="small">{{ item.type }}</el-tag>
                  <el-tag
                    size="small"
                    :type="item.status === '进行中' ? 'success' : 'info'"
                    effect="plain"
                  >
                    {{ item.status }}
                  </el-tag>
                  <span class="item-time">{{ item.time }}</span>
                </div>
              </div>
              <el-dropdown @command="(cmd: string) => emitStatusUpdate(item.id, cmd)">
                <el-button size="small" round>
                  更新状态 <el-icon class="el-icon--right"><Right /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="进行中">进行中</el-dropdown-item>
                    <el-dropdown-item command="已完成">已完成</el-dropdown-item>
                    <el-dropdown-item command="已关闭">已关闭</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-empty v-else description="还没有发布，去发布第一条吧">
            <RouterLink to="/publish">
              <el-button type="primary">去发布</el-button>
            </RouterLink>
          </el-empty>
        </el-tab-pane>

        <!-- 我的收藏 -->
        <el-tab-pane label="我的收藏" name="favorites">
          <div v-if="myFavorites.length" class="fav-grid">
            <div v-for="item in myFavorites" :key="item.id" class="fav-card">
              <RouterLink :to="`/detail/${item.id}`" class="fav-link">
                <div class="fav-title">{{ item.title }}</div>
                <div class="fav-bottom">
                  <span class="fav-price">¥{{ item.price }}</span>
                  <el-tag :type="typeTagColor(item.type)" size="small">{{ item.type }}</el-tag>
                </div>
              </RouterLink>
              <el-popconfirm
                title="确定取消收藏？"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button class="fav-remove" size="small" text type="danger">
                    取消收藏
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <el-empty v-else description="还没有收藏，去逛逛集市吧">
            <RouterLink to="/list">
              <el-button type="primary">去逛逛</el-button>
            </RouterLink>
          </el-empty>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- D. 其他功能区 -->
    <el-card class="setting-card">
      <div class="setting-item">
        <span>💡 交易安全提醒</span>
        <el-icon><Right /></el-icon>
      </div>
      <div class="setting-item">
        <span>ℹ️ 关于校园轻集市</span>
        <el-icon><Right /></el-icon>
      </div>
      <div class="setting-item quit">
        <span>退出登录</span>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 800px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 20px;
}

/* ===== A. 用户卡片（Hero） ===== */
.user-hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #4a90d9 0%, #6ba5e7 100%);
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 3px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
}

.hero-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.hero-tags {
  display: flex;
  gap: 6px;
}

.hero-tags :deep(.el-tag--dark) {
  background: rgba(255,255,255,0.2);
  border-color: transparent;
  color: #ffffff;
}

.hero-credit {
  text-align: center;
  flex-shrink: 0;
}

.credit-num {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.credit-text {
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  margin-top: 4px;
}

.hero-edit {
  position: absolute;
  top: 16px;
  right: 20px;
}

/* ===== B. 数据概览 ===== */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.stat-cell {
  background: #ffffff;
  padding: 16px;
  text-align: center;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

/* ===== C. 标签页 ===== */
.content-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.tab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.tab-item:last-child {
  border-bottom: none;
}

.tab-item-left {
  flex: 1;
  min-width: 0;
}

.item-title-link {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a2e;
  text-decoration: none;
  display: block;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title-link:hover {
  color: #4a90d9;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-time {
  font-size: 12px;
  color: #c0c4cc;
}

/* 收藏网格 */
.fav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.fav-card {
  background: #fafbfc;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 14px;
  position: relative;
}

.fav-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 8px;
}

.fav-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b3d;
}

.fav-remove {
  font-size: 12px;
}

/* ===== D. 设置区 ===== */
.setting-card {
  border-radius: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  cursor: pointer;
  color: #374151;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  color: #4a90d9;
}

.setting-item.quit {
  color: #9ca3af;
  justify-content: center;
  font-size: 13px;
}

.setting-item.quit:hover {
  color: #ef4444;
}
</style>
