<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>选择发布类型，填写必要信息，让校园需求更快被看见。</p>
    </div>

    <div v-if="!userStore.isLoggedIn" class="not-logged-in">
      <div class="icon-wrap">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-4.8 0-8.4 2.1-8.4 4.8v2.4h16.8v-2.4c0-2.7-3.6-4.8-8.4-4.8z"/></svg>
      </div>
      <p class="not-logged-in-text">请先登录后再发布信息</p>
      <el-button type="primary" size="large" @click="openLogin">去登录</el-button>
    </div>

    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header style-type">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>选择类型</span>
          </div>
        </template>
        <el-form-item label="发布类型" prop="publishType">
          <el-select v-model="publishType" placeholder="请选择发布类型" style="width: 100%">
            <el-option label="二手交易" value="trade" />
            <el-option label="失物招领" value="lostFound" />
            <el-option label="拼单搭子" value="groupBuy" />
            <el-option label="跑腿委托" value="errand" />
          </el-select>
        </el-form-item>
      </el-card>

      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header style-basic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>基本信息</span>
          </div>
        </template>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :auto-upload="false"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            @change="handleFileChange"
          >
            <img v-if="form.image" :src="form.image" class="upload-preview" />
            <div v-else class="upload-placeholder">
              <el-icon :size="24"><Plus /></el-icon>
              <span>选择图片</span>
            </div>
          </el-upload>
          <el-input v-model="form.image" placeholder="或输入图片链接" class="upload-url-input" />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请详细描述具体情况" maxlength="500" show-word-limit />
        </el-form-item>
      </el-card>

      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header style-extra">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <span>补充信息</span>
          </div>
        </template>

        <template v-if="publishType === 'trade'">
          <el-form-item label="商品分类" prop="category">
            <el-input v-model="form.category" placeholder="如：数码配件、教材资料、生活用品" />
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="价格 (¥)" prop="price">
                <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成色" prop="condition">
                <el-select v-model="form.condition" placeholder="请选择成色" style="width: 100%">
                  <el-option label="全新" value="全新" />
                  <el-option label="九成新" value="九成新" />
                  <el-option label="八成新" value="八成新" />
                  <el-option label="正常使用痕迹" value="正常使用痕迹" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="校区" prop="campus">
            <el-select v-model="form.campus" placeholder="请选择校区" style="width: 100%">
              <el-option label="北校区" value="北校区" />
              <el-option label="南校区" value="南校区" />
              <el-option label="东校区" value="东校区" />
              <el-option label="西校区" value="西校区" />
            </el-select>
          </el-form-item>
        </template>

        <template v-if="publishType === 'lostFound'">
          <el-form-item label="信息类型" prop="lostFoundType">
            <el-radio-group v-model="form.lostFoundType">
              <el-radio value="lost">寻物</el-radio>
              <el-radio value="found">招领</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="物品名称" prop="itemName">
            <el-input v-model="form.itemName" placeholder="请输入物品名称" />
          </el-form-item>
          <el-form-item label="发生时间" prop="eventTime">
            <el-date-picker v-model="form.eventTime" type="datetime" placeholder="选择发生时间" style="width: 100%" />
          </el-form-item>
        </template>

        <template v-if="publishType === 'groupBuy'">
          <el-form-item label="拼单类型" prop="groupType">
            <el-input v-model="form.groupType" placeholder="如：拼餐、资料团购、运动搭子" />
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="目标人数" prop="targetCount">
                <el-input-number v-model="form.targetCount" :min="2" :max="100" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止时间" prop="deadline">
                <el-date-picker v-model="form.deadline" type="datetime" placeholder="选择截止时间" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="publishType === 'errand'">
          <el-form-item label="任务类型" prop="taskType">
            <el-input v-model="form.taskType" placeholder="如：取快递、代买、代送" />
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="酬劳 (¥)" prop="reward">
                <el-input-number v-model="form.reward" :min="0" :precision="2" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止时间" prop="deadline">
                <el-date-picker v-model="form.deadline" type="datetime" placeholder="选择截止时间" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="取件地点" prop="from">
                <el-input v-model="form.from" placeholder="请输入取件地点" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="送达地点" prop="to">
                <el-input v-model="form.to" placeholder="请输入送达地点" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-card>

      <div class="form-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" native-type="submit" :loading="submitting" size="large">
          {{ submitting ? '发布中...' : '确认发布' }}
        </el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useUserStore } from '../stores/user'

function openLogin() {
  const header = document.querySelector('.app-header')
  if (header) {
    const btn = header.querySelector('.el-button--primary') as HTMLElement
    btn?.click()
  }
}
import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const publishType = ref('trade')

const form = reactive({
  title: '',
  location: '',
  image: '',
  description: '',
  category: '',
  price: 0,
  condition: '',
  campus: '',
  lostFoundType: 'lost',
  itemName: '',
  eventTime: '',
  groupType: '',
  targetCount: 2,
  deadline: '',
  taskType: '',
  reward: 0,
  from: '',
  to: '',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  category: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
  campus: [{ required: true, message: '请选择校区', trigger: 'change' }],
  itemName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
  eventTime: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
  groupType: [{ required: true, message: '请输入拼单类型', trigger: 'blur' }],
  targetCount: [{ required: true, message: '请输入目标人数', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  taskType: [{ required: true, message: '请输入任务类型', trigger: 'blur' }],
  reward: [{ required: true, message: '请输入酬劳', trigger: 'blur' }],
  from: [{ required: true, message: '请输入取件地点', trigger: 'blur' }],
  to: [{ required: true, message: '请输入送达地点', trigger: 'blur' }],
}

function formatDate(d: Date | string): string {
  if (typeof d === 'string') return d
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function handleFileChange(uploadFile: UploadFile) {
  const file = uploadFile.raw
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    form.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function resetForm() {
  formRef.value?.resetFields()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const publisher = userStore.currentUser.name

    if (publishType.value === 'trade') {
      await createTrade({
        title: form.title,
        category: form.category,
        price: form.price,
        condition: form.condition,
        location: form.location,
        campus: form.campus,
        publisher,
        publishTime: now,
        image: form.image,
        status: 'open',
        description: form.description,
      })
      ElMessage.success('发布成功！')
      router.push('/list')
    } else if (publishType.value === 'lostFound') {
      await createLostFound({
        title: form.title,
        type: form.lostFoundType as 'lost' | 'found',
        itemName: form.itemName,
        location: form.location,
        eventTime: formatDate(form.eventTime),
        contact: '站内消息联系',
        publisher,
        status: 'open',
        description: form.description,
      })
      ElMessage.success('发布成功！')
      router.push('/lost-found')
    } else if (publishType.value === 'groupBuy') {
      await createGroupBuy({
        title: form.title,
        type: form.groupType,
        targetCount: form.targetCount,
        currentCount: 1,
        deadline: formatDate(form.deadline),
        location: form.location,
        publisher,
        status: 'open',
        description: form.description,
      })
      ElMessage.success('发布成功！')
      router.push('/group-buy')
    } else if (publishType.value === 'errand') {
      await createErrand({
        title: form.title,
        taskType: form.taskType,
        reward: form.reward,
        from: form.from,
        to: form.to,
        deadline: formatDate(form.deadline),
        publisher,
        status: 'open',
        description: form.description,
      })
      ElMessage.success('发布成功！')
      router.push('/errand')
    }
  } catch {
    ElMessage.error('发布失败，请检查 Mock 服务是否正常运行')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; max-width: 720px; margin: 0 auto; }

.not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 16px;
  color: var(--text-secondary, #6b7280);
}

.icon-wrap svg {
  color: var(--text-tertiary, #9ca3af);
}

.not-logged-in-text {
  font-size: 16px;
  margin: 0;
}

.page-header {
  padding: 24px;
  border-radius: var(--radius-xl, 16px);
  background: var(--bg-card, #fff);
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: var(--text-primary, #111827);
}

.page-header p {
  margin: 0;
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
}

.section-card {
  border-radius: var(--radius-lg, 12px);
}

.section-card + .section-card {
  margin-top: 0;
}

.section-card :deep(.el-card__header) {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
}

.section-card :deep(.el-card__body) {
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.section-header svg {
  flex-shrink: 0;
}

.style-type svg { color: var(--color-primary, #2563eb); }
.style-basic svg { color: var(--color-success, #10b981); }
.style-extra svg { color: var(--color-warning, #f59e0b); }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 4px;
}

.image-uploader { margin-bottom: 8px; }

.upload-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px dashed var(--border-color, #d9d9d9);
  border-radius: var(--radius-md, 8px);
  background: var(--bg-input, #fafbfc);
  color: var(--text-tertiary, #9ca3af);
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-placeholder:hover {
  border-color: var(--color-primary, #409eff);
  color: var(--color-primary, #409eff);
}

.upload-url-input { margin-top: 4px; }
</style>
