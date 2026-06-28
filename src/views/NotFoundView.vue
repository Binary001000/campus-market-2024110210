<script setup lang="ts"></script>

<template>
  <div class="not-found">
    <el-result
      icon="error"
      title="404"
      sub-title="页面不存在或已被移除"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}
</style>
