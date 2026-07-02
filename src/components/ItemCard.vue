<template>
  <component :is="to ? 'router-link' : 'div'" :to="to" class="item-card" :class="{ 'is-link': to }">
    <div class="card-image">
      <img v-if="image" :src="image" alt="" referrerpolicy="no-referrer" loading="lazy" />
      <div v-else class="card-image-placeholder">
        <span class="placeholder-icon">{{ tag ? getIconForTag(tag) : '📦' }}</span>
      </div>
      <span v-if="tag" class="card-tag">{{ tag }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="description" class="card-desc">{{ description }}</p>
      <div class="card-meta">
        <span v-if="price" class="card-price">¥{{ price }}</span>
        <span v-if="extra" class="card-extra">{{ extra }}</span>
      </div>
      <div v-if="location || time" class="card-footer">
        <span v-if="location" class="card-location">{{ location }}</span>
        <span v-if="time" class="card-time">{{ time }}</span>
      </div>
      <div v-if="$slots.footer" class="card-actions">
        <slot name="footer" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  description?: string
  tag?: string
  location?: string
  time?: string
  to?: RouteLocationRaw
  image?: string
  price?: string | number
  extra?: string
}>()

function getIconForTag(tag: string): string {
  const map: Record<string, string> = {
    '丢失': '🔍', '拾获': '🔔',
    '拼餐': '🍽️', '学习资料': '📚', '学习搭子': '✏️', '运动搭子': '🏃', '拼购': '🛍️',
    '代取快递': '📦', '代买': '🛵', '代办': '📋', '代排队': '🎫',
    '拼单搭子': '👥', '跑腿委托': '🏃', '失物招领': '🔍',
  }
  return map[tag] || '📦'
}
</script>

<style scoped>
.item-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color, #e5e7eb);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
  text-decoration: none;
  color: inherit;
}

.item-card.is-link:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f3f4f6;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .card-image img {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 40px;
  opacity: 0.5;
}

.card-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary, #2563eb);
  border-radius: var(--radius-full, 9999px);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #111827);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-price, #ff6b3d);
}

.card-extra {
  font-size: 13px;
  color: var(--text-tertiary, #9ca3af);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
  padding-top: 4px;
  border-top: 1px solid var(--border-color, #f3f4f6);
}

.card-actions {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color, #f3f4f6);
}
</style>
