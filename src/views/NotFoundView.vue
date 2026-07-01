<script setup lang="ts">
// 404 页面 — 渐变文字 + 返回首页/上一页按钮
import { ArrowLeft, HomeFilled } from '@element-plus/icons-vue'
</script>

<template>
  <div class="not-found">
    <div class="nf-content">
      <span class="nf-emoji">🔍</span>
      <h1 class="nf-code">404</h1>
      <h2 class="nf-title">页面走丢了</h2>
      <p class="nf-desc">你访问的页面不存在或已被移除</p>
      <div class="nf-actions">
        <el-button type="primary" size="large" :icon="HomeFilled" round @click="$router.push('/')">
          返回首页
        </el-button>
        <el-button size="large" :icon="ArrowLeft" round @click="$router.back()">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.nf-content {
  text-align: center;
}

.nf-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.nf-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, #4a90d9 0%, #ff6b3d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nf-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 16px 0 8px;
}

.nf-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
}

.nf-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
