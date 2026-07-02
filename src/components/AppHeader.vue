<template>
  <header class="app-header">
    <div class="brand">
      <span class="logo">校园轻集市</span>
      <span class="slogan">轻量、可信、面向校园生活</span>
    </div>

    <AppNav />

    <div class="header-right">
      <div v-if="userStore.isLoggedIn" class="user-info">
        <span class="user-avatar" :style="{ background: avatarColor }">{{ userStore.displayName.charAt(0) }}</span>
        <span class="user-name">{{ userStore.displayName }}</span>
        <el-button size="small" plain @click="handleLogout">退出</el-button>
      </div>
      <el-button v-else size="small" type="primary" @click="loginVisible = true">登录</el-button>
    </div>

    <el-dialog v-model="loginVisible" title="登录 / 注册" width="420px" top="20vh" align-center destroy-on-close>
      <div v-if="users.length" class="user-list">
        <p class="dialog-hint">选择已有用户登录</p>
        <div class="user-options">
          <div
            v-for="u in users"
            :key="u.id"
            class="user-option"
            @click="handleLoginAs(u)"
          >
            <span class="user-option-avatar" :style="{ background: userColor(u.name) }">{{ u.name.charAt(0) }}</span>
            <div class="user-option-info">
              <span class="user-option-name">{{ u.name }}</span>
              <span class="user-option-desc">{{ u.college }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-divider>
        <span class="divider-text">注册新用户</span>
      </el-divider>

      <el-form ref="registerForm" :model="registerData" :rules="registerRules" label-position="top" size="small" @submit.prevent="handleRegister">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="registerData.name" placeholder="请输入昵称" maxlength="20" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="学院" prop="college">
              <el-input v-model="registerData.college" placeholder="如：计算机学院" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="registerData.grade" placeholder="如：2023 级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个性签名">
          <el-input v-model="registerData.bio" placeholder="选填" maxlength="50" />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="registering" class="register-btn">
          {{ registering ? '注册中...' : '注册并登录' }}
        </el-button>
      </el-form>

      <template #footer>
        <span class="dialog-footer-hint">所有数据仅保存在本地 JSON Server</span>
      </template>
    </el-dialog>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getUsers, createUser, type UserRecord } from '../api/user'

const userStore = useUserStore()
const avatarColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

const loginVisible = ref(false)
const users = ref<UserRecord[]>([])
const registerForm = ref<FormInstance>()
const registering = ref(false)

const registerData = ref({
  name: '',
  college: '',
  grade: '',
  bio: '',
})

const registerRules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  college: [{ required: true, message: '请输入学院', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
}

function userColor(name: string): string {
  const colors = ['#667eea', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) | 0
  return colors[Math.abs(hash) % colors.length]!
}

async function loadUsers() {
  try {
    const res = await getUsers()
    users.value = res.data
  } catch {
    ElMessage.error('无法获取用户列表，请检查 Mock 服务')
  }
}

function handleLoginAs(u: UserRecord) {
  userStore.setUser(u)
  loginVisible.value = false
  ElMessage.success(`欢迎回来，${u.name}！`)
}

async function handleRegister() {
  const valid = await registerForm.value?.validate().catch(() => false)
  if (!valid) return

  registering.value = true
  try {
    const res = await createUser({
      name: registerData.value.name,
      college: registerData.value.college,
      grade: registerData.value.grade,
      avatar: '',
      bio: registerData.value.bio,
    })
    userStore.setUser(res.data)
    loginVisible.value = false
    ElMessage.success(`注册成功，欢迎 ${res.data.name}！`)
  } catch {
    ElMessage.error('注册失败，请检查 Mock 服务')
  } finally {
    registering.value = false
  }
}

function handleLogout() {
  userStore.logout()
  ElMessage.info('已退出登录')
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    loadUsers()
  }
})
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-header, #fff);
  position: sticky;
  top: 0;
  z-index: 200;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #1a1a2e);
}

.slogan {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary, #374151);
}

.dialog-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.user-list {
  margin-bottom: 4px;
}

.user-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.user-option:hover {
  background: var(--color-primary-light, #eff6ff);
  border-color: var(--color-primary, #2563eb);
}

.user-option-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-option-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-option-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.user-option-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.divider-text {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}

.register-btn {
  width: 100%;
  margin-top: 4px;
}

.dialog-footer-hint {
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
}
</style>
