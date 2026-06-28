<script setup lang="ts">
import { ref } from 'vue'

const user = {
  nickname: '校园用户',
  college: '计算机学院',
  campus: '北校区',
  role: '学生',
  creditScore: 100,
  avatar: '👤',
}

const myPublishes = [
  { id: 1, title: '《数据结构》教材 9成新', type: '二手交易', status: '进行中', time: '2026-06-28' },
  { id: 3, title: '台灯 LED 护眼', type: '二手交易', status: '已完成', time: '2026-06-27' },
]

const myFavorites = [
  { id: 2, title: '机械键盘 Cherry 青轴', type: '二手交易', price: 180, time: '2026-06-27' },
  { id: 7, title: '蓝牙耳机 降噪版', type: '二手交易', price: 120, time: '2026-06-25' },
]

const activeTab = ref('publishes')
</script>

<template>
  <div class="profile-page">
    <h2>个人中心</h2>

    <!-- 用户资料卡 -->
    <el-card class="user-card">
      <div class="user-info">
        <div class="user-avatar">{{ user.avatar }}</div>
        <div class="user-details">
          <div class="user-name">{{ user.nickname }}</div>
          <div class="user-meta">
            <el-tag size="small">{{ user.college }}</el-tag>
            <el-tag size="small" type="success">{{ user.campus }}</el-tag>
            <el-tag size="small" type="warning">{{ user.role }}</el-tag>
          </div>
        </div>
        <div class="user-credit">
          <div class="credit-score">{{ user.creditScore }}</div>
          <div class="credit-label">信用分</div>
        </div>
      </div>
    </el-card>

    <!-- 我的发布 / 我的收藏 -->
    <el-card class="content-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="我的发布" name="publishes">
          <div v-if="myPublishes.length" class="item-list">
            <div v-for="item in myPublishes" :key="item.id" class="item-row">
              <RouterLink :to="`/detail/${item.id}`" class="item-link">
                <span class="item-title">{{ item.title }}</span>
              </RouterLink>
              <div class="item-right">
                <el-tag size="small">{{ item.type }}</el-tag>
                <el-tag size="small" :type="item.status === '进行中' ? 'success' : 'info'">
                  {{ item.status }}
                </el-tag>
                <span class="item-time">{{ item.time }}</span>
                <el-button size="small" text>更新状态</el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无发布" />
        </el-tab-pane>

        <el-tab-pane label="我的收藏" name="favorites">
          <div v-if="myFavorites.length" class="item-list">
            <div v-for="item in myFavorites" :key="item.id" class="item-row">
              <RouterLink :to="`/detail/${item.id}`" class="item-link">
                <span class="item-title">{{ item.title }}</span>
              </RouterLink>
              <div class="item-right">
                <el-tag size="small">{{ item.type }}</el-tag>
                <span class="item-price">¥{{ item.price }}</span>
                <span class="item-time">{{ item.time }}</span>
                <el-button size="small" text type="danger">取消收藏</el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无收藏" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 800px;
}

.user-card {
  margin-top: 16px;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  font-size: 48px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-meta {
  display: flex;
  gap: 6px;
}

.user-credit {
  text-align: center;
  flex-shrink: 0;
}

.credit-score {
  font-size: 32px;
  font-weight: 700;
  color: #f56c6c;
}

.credit-label {
  font-size: 12px;
  color: #909399;
}

/* 列表 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-row:last-child {
  border-bottom: none;
}

.item-link {
  text-decoration: none;
  color: #303133;
  flex: 1;
  min-width: 0;
}

.item-link:hover {
  color: #1890ff;
}

.item-title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 16px;
}

.item-time {
  font-size: 12px;
  color: #c0c4cc;
}

.item-price {
  font-size: 15px;
  font-weight: 600;
  color: #f56c6c;
}
</style>
