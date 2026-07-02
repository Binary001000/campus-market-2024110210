<template>
  <div class="skeleton-card" :style="{ width: width }">
    <div class="skeleton-image" />
    <div class="skeleton-body">
      <div class="skeleton-line w-75" />
      <div class="skeleton-line w-50" />
      <div class="skeleton-line w-30" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
}>(), {
  width: '100%',
})
</script>

<style scoped>
.skeleton-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color, #e5e7eb);
  overflow: hidden;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-75 { width: 75%; }
.w-50 { width: 50%; }
.w-30 { width: 30%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
