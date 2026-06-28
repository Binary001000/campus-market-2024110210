<script setup lang="ts"></script>

<template>
  <main class="app">
    <h1>校园轻集市</h1>
    <p>AI 辅助前端工程实践种子项目</p>

    <nav class="nav">
      <RouterLink to="/home">首页</RouterLink>
      <RouterLink to="/list">列表</RouterLink>
      <RouterLink to="/publish">发布</RouterLink>
      <RouterLink to="/message">消息</RouterLink>
      <RouterLink to="/profile">我的</RouterLink>
    </nav>

    <RouterView />
  </main>
</template>

<style scoped>
.app {
  padding: 32px;
}

.nav {
  display: flex;
  gap: 16px;
  margin: 16px 0;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.nav a {
  text-decoration: none;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
}

.nav a:hover {
  background: #f0f0f0;
}

.nav a.router-link-active {
  color: #1890ff;
  font-weight: bold;
}
</style>