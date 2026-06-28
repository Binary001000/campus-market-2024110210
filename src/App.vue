<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = computed(() => route.path)
</script>

<template>
  <main class="app">
    <h1>校园轻集市</h1>
    <p>AI 辅助前端工程实践种子项目</p>

    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :ellipsis="false"
      router
      class="nav-menu"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/list">列表</el-menu-item>
      <el-menu-item index="/publish">发布</el-menu-item>
      <el-menu-item index="/message">消息</el-menu-item>
      <el-menu-item index="/profile">我的</el-menu-item>
      <el-menu-item index="/board">看板</el-menu-item>
    </el-menu>

    <div class="page-content">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.app {
  padding: 0;
}

.app h1,
.app > p {
  padding: 0 32px;
}

.app > p {
  color: #999;
  margin-bottom: 8px;
}

.nav-menu {
  margin-bottom: 24px;
}

.page-content {
  padding: 0 32px 32px;
}
</style>