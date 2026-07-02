<template>
  <nav class="app-nav">
    <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
      <span class="nav-icon" v-html="link.icon"></span>
      <span class="nav-label">{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const links = [
  {
    to: '/',
    label: '首页',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1v-9"/></svg>',
  },
  {
    to: '/list',
    label: '二手集市',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  },
  {
    to: '/lost-found',
    label: '失物招领',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  },
  {
    to: '/group-buy',
    label: '拼单搭子',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    to: '/errand',
    label: '跑腿委托',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8l-4 4"/><path d="M12 16l4 4"/><path d="M8 12h8"/></svg>',
  },
  {
    to: '/publish',
    label: '发布',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  },
  {
    to: '/message',
    label: '消息',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  },
  {
    to: '/user',
    label: '我的',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  },
]
</script>

<style scoped>
.app-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  text-decoration: none;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  border-radius: var(--radius-md, 8px);
  transition: background 0.2s, color 0.2s;
  position: relative;
}

.nav-link:hover {
  background: var(--color-primary-light, #eff6ff);
  color: var(--color-primary, #2563eb);
}

.nav-link.router-link-active {
  color: var(--color-primary, #2563eb);
  font-weight: 600;
  background: var(--color-primary-light-9, #f0f5ff);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: var(--color-primary, #2563eb);
  border-radius: 1px;
}

.nav-icon {
  display: flex;
  align-items: center;
}
</style>
