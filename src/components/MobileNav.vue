<template>
  <nav class="mobile-nav">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="mobile-link">
      <span class="mobile-icon" v-html="item.icon"></span>
      <span class="mobile-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const items = [
  {
    to: '/',
    label: '首页',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1v-9"/></svg>',
  },
  {
    to: '/list',
    label: '集市',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  },
  {
    to: '/publish',
    label: '发布',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  },
  {
    to: '/message',
    label: '消息',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  },
  {
    to: '/user',
    label: '我的',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  },
]
</script>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: var(--bg-card, #fff);
  border-top: 1px solid var(--border-color, #e5e7eb);
  padding: 6px 0 env(safe-area-inset-bottom, 6px);
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
}

.mobile-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  padding: 4px 12px;
  border-radius: var(--radius-md, 8px);
  transition: color 0.2s;
  color: var(--text-tertiary, #9ca3af);
}

.mobile-link.router-link-active {
  color: var(--color-primary, #2563eb);
}

.mobile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.mobile-label {
  font-size: 10px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}
</style>
