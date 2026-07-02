<template>
  <div class="error-state">
    <svg class="error-icon" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="40" stroke="#fecaca" stroke-width="3" fill="#fef2f2" />
      <path d="M70 50L50 70M50 50l20 20" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
      <circle cx="60" cy="60" r="4" fill="#ef4444" />
    </svg>
    <h3 class="error-title">加载失败</h3>
    <p class="error-message">{{ message }}</p>
    <button v-if="showRetry" type="button" class="retry-btn" @click="$emit('retry')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right:6px;vertical-align:-2px">
        <path d="M2 8a6 6 0 0 1 10.47-4M14 2v4h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  showRetry?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  background: var(--bg-card, #fef2f2);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid #fecaca;
  gap: 12px;
}

.error-icon {
  width: 80px;
  height: 80px;
}

.error-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #991b1b;
}

.error-message {
  margin: 0;
  font-size: 14px;
  color: #b91c1c;
  line-height: 1.5;
  max-width: 360px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: var(--radius-md, 8px);
  padding: 8px 18px;
  cursor: pointer;
  background: #dc2626;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  margin-top: 4px;
}

.retry-btn:hover {
  background: #b91c1c;
}
</style>
