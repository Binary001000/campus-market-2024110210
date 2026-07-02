<template>
  <div class="empty-state">
    <svg class="empty-icon" viewBox="0 0 120 120" fill="none">
      <rect x="20" y="40" width="80" height="50" rx="8" stroke="#d1d5db" stroke-width="2" fill="#f9fafb" />
      <rect x="30" y="60" width="30" height="4" rx="2" fill="#e5e7eb" />
      <rect x="30" y="70" width="50" height="4" rx="2" fill="#e5e7eb" />
      <circle cx="85" cy="75" r="18" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" />
      <path d="M80 75h10M85 70v10" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" />
    </svg>
    <p class="empty-text">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 12px);
  border: 1px dashed var(--border-color, #d1d5db);
  gap: 16px;
}

.empty-icon {
  width: 96px;
  height: 96px;
  opacity: 0.8;
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-tertiary, #9ca3af);
  line-height: 1.5;
}
</style>
