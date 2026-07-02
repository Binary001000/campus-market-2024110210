<template>
  <AppLayout />
</template>

<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
</script>

<style>
:root {
  --bg-page: #f5f7fb;
  --bg-secondary: #f9fafb;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --bg-input: #f9fafb;
  --border-color: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --color-primary: #2563eb;
  --color-primary-light: #eff6ff;
  --color-primary-light-9: #f0f5ff;
  --color-primary-dark: #1d4ed8;
  --color-price: #ff6b3d;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-hover: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --scrollbar-thumb: #c0c4cc;
  --scrollbar-thumb-hover: #909399;
}

body {
  margin: 0;
  background: var(--bg-page);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }
</style>
