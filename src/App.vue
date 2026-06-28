<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Goods,
  CirclePlus,
  ChatDotRound,
  UserFilled,
  DataAnalysis,
} from '@element-plus/icons-vue'

const route = useRoute()

const navItems = [
  { path: '/home', label: '首页', icon: HomeFilled },
  { path: '/list', label: '集市', icon: Goods },
  { path: '/publish', label: '发布', icon: CirclePlus },
  { path: '/message', label: '消息', icon: ChatDotRound },
  { path: '/profile', label: '我的', icon: UserFilled },
  { path: '/board', label: '看板', icon: DataAnalysis },
]

const isActive = (path: string) => {
  if (path === '/home') return route.path === '/' || route.path === '/home'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="app-shell">
    <!-- 全局导航栏 -->
    <header class="nav-bar">
      <div class="nav-inner">
        <!-- 左区：Logo -->
        <RouterLink to="/" class="nav-logo">
          <span class="logo-icon">🏪</span>
          <span class="logo-text">校园轻集市</span>
        </RouterLink>

        <!-- 中区：导航项 -->
        <nav class="nav-center">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <el-icon class="nav-item-icon"><component :is="item.icon" /></el-icon>
            <span class="nav-item-label">{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- 右区：用户 -->
        <div class="nav-user">
          <div class="user-avatar">👤</div>
          <span class="user-name">校园用户</span>
        </div>
      </div>
    </header>

    <!-- 页面内容（KeepAlive 缓存组件状态，返回时不丢失筛选/分页） -->
    <main class="page-content">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  background: #f5f6fa;
  color: #1a1a2e;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f5f6fa;
}

/* ===== 导航栏 ===== */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  height: 56px;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
}

/* 左区 Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #4a90d9;
  letter-spacing: 0.5px;
}

/* 中区导航 */
.nav-center {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  position: relative;
  transition: color 0.2s, background 0.2s;
}

.nav-item:hover {
  color: #4a90d9;
  background: #f0f5ff;
}

.nav-item.active {
  color: #4a90d9;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #4a90d9;
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item-icon {
  font-size: 16px;
}

.nav-item-label {
  font-size: 14px;
}

/* 右区用户 */
.nav-user {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-user:hover {
  background: #f5f6fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.user-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

/* ===== 页面内容 ===== */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
