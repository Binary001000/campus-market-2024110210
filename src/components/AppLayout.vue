<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView />  <!-- 路由视图插槽，匹配当前 URL 渲染对应页面 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f5f7fb;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
