<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(0)
const infoType = ref('secondhand')
const tagInput = ref('')
const tags = ref<string[]>([])
const campuses = ['北校区', '南校区', '东校区', '西校区']

const typeCards = [
  { value: 'secondhand', label: '二手交易', icon: '🛒', desc: '闲置物品买卖' },
  { value: 'lostfound', label: '失物招领', icon: '🔍', desc: '丢失 & 拾获互助' },
  { value: 'group', label: '拼单搭子', icon: '👥', desc: '拼单 & 找搭子' },
  { value: 'errand', label: '跑腿委托', icon: '🏃', desc: '代取快递 & 代办事务' },
]

const addTag = () => {
  const val = tagInput.value.trim()
  if (val && !tags.value.includes(val)) {
    tags.value.push(val)
    tagInput.value = ''
  }
}

const removeTag = (t: string) => {
  tags.value = tags.value.filter(tag => tag !== t)
}

const handleTagKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}
</script>

<template>
  <div class="publish-page">
    <h2 class="page-title">发布信息</h2>

    <!-- A. 步骤引导 -->
    <el-steps :active="currentStep" align-center class="steps-bar" finish-status="success">
      <el-step title="选择类型" />
      <el-step title="填写信息" />
      <el-step title="发布" />
    </el-steps>

    <!-- B. 类型选择卡片 -->
    <section class="type-section">
      <div class="type-grid">
        <div
          v-for="card in typeCards"
          :key="card.value"
          class="type-card"
          :class="{ selected: infoType === card.value }"
          @click="infoType = card.value"
        >
          <span v-if="infoType === card.value" class="type-check">✓</span>
          <div class="type-icon">{{ card.icon }}</div>
          <div class="type-label">{{ card.label }}</div>
          <div class="type-desc">{{ card.desc }}</div>
        </div>
      </div>
    </section>

    <!-- C. 表单区 -->
    <el-card class="form-card">
      <!-- 通用字段 -->
      <div class="form-section">
        <label class="form-label">标题 <span class="required">*</span></label>
        <el-input placeholder="写下吸引人的标题吧～" maxlength="50" show-word-limit size="large" />
      </div>

      <el-row :gutter="16">
        <el-col :span="12">
          <div class="form-section">
            <label class="form-label">校区 <span class="required">*</span></label>
            <el-select placeholder="请选择校区" style="width: 100%" size="large">
              <el-option v-for="c in campuses" :key="c" :label="c" :value="c" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="form-section">
            <label class="form-label">地点 <span class="required">*</span></label>
            <el-input placeholder="如图书馆门口" size="large" />
          </div>
        </el-col>
      </el-row>

      <div class="form-section">
        <label class="form-label">详细描述 <span class="required">*</span></label>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="描述物品特征、成色、使用情况等细节信息..."
          maxlength="500"
          show-word-limit
        />
      </div>

      <!-- 标签输入 -->
      <div class="form-section">
        <label class="form-label">标签</label>
        <div class="tag-input-area">
          <el-tag
            v-for="t in tags"
            :key="t"
            closable
            size="small"
            class="tag-chip"
            @close="removeTag(t)"
          >
            {{ t }}
          </el-tag>
          <el-input
            v-model="tagInput"
            v-if="tags.length < 5"
            placeholder="输入标签，回车添加"
            size="small"
            class="tag-input-inline"
            @keydown="handleTagKeydown"
          />
        </div>
      </div>

      <!-- 图片上传占位 -->
      <div class="form-section">
        <label class="form-label">图片</label>
        <div class="upload-area">
          <div class="upload-grid">
            <div class="upload-box">
              <span class="upload-plus">+</span>
              <span class="upload-hint">上传图片</span>
            </div>
            <div class="upload-box empty" />
            <div class="upload-box empty" />
            <div class="upload-box empty" />
          </div>
        </div>
      </div>

      <el-divider />

      <!-- D. 类型专属字段 -->
      <!-- 二手交易 -->
      <template v-if="infoType === 'secondhand'">
        <h4 class="section-title">🛒 二手交易信息</h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">价格 (¥) <span class="required">*</span></label>
              <el-input placeholder="0.00" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">成色</label>
              <el-select placeholder="请选择" style="width: 100%" size="large">
                <el-option label="全新" value="全新" />
                <el-option label="九成新" value="九成新" />
                <el-option label="七成新" value="七成新" />
                <el-option label="五成新" value="五成新" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">允许砍价</label>
              <div class="switch-row">
                <el-switch size="large" />
                <span class="switch-label">开启后买家可出价</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 失物招领 -->
      <template v-if="infoType === 'lostfound'">
        <h4 class="section-title">🔍 失物招领信息</h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">类型</label>
              <el-radio-group size="large">
                <el-radio value="lost">丢失物品</el-radio>
                <el-radio value="found">拾获物品</el-radio>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">发生时间</label>
              <el-input placeholder="如：2026-06-28 上午" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">物品特征</label>
              <el-input placeholder="颜色/品牌/特殊标记" size="large" />
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 拼单搭子 -->
      <template v-if="infoType === 'group'">
        <h4 class="section-title">👥 拼单搭子信息</h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">目标人数</label>
              <el-input-number :min="2" :max="99" style="width: 100%" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">当前人数</label>
              <el-input-number :min="1" :max="99" style="width: 100%" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">截止时间</label>
              <el-input placeholder="如：2026-06-30" size="large" />
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 跑腿委托 -->
      <template v-if="infoType === 'errand'">
        <h4 class="section-title">🏃 跑腿委托信息</h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">酬劳 (¥)</label>
              <el-input placeholder="0.00" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">任务地点</label>
              <el-input placeholder="如：菜鸟驿站" size="large" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">期望完成时间</label>
              <el-input placeholder="如：2026-06-28 18:00" size="large" />
            </div>
          </el-col>
        </el-row>
      </template>
    </el-card>

    <!-- E. 底部操作栏 -->
    <div class="bottom-bar">
      <el-button size="large" round>保存草稿</el-button>
      <el-button type="primary" size="large" round>发布信息</el-button>
    </div>
  </div>
</template>

<style scoped>
.publish-page {
  max-width: 800px;
  padding-bottom: 80px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 20px;
}

/* ===== A. 步骤条 ===== */
.steps-bar {
  margin-bottom: 28px;
}

/* ===== B. 类型选择卡片 ===== */
.type-section {
  margin-bottom: 20px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.type-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.type-card:hover {
  border-color: #4a90d9;
}

.type-card.selected {
  border-color: #4a90d9;
  background: #eff6ff;
}

.type-check {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #4a90d9;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.type-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.type-label {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 12px;
  color: #9ca3af;
}

/* ===== C. 表单 ===== */
.form-card {
  border-radius: 12px;
}

.form-section {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

/* 标签输入 */
.tag-input-area {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 38px;
}

.tag-chip {
  height: 26px;
}

.tag-input-inline {
  width: 140px;
}

.tag-input-inline :deep(.el-input__wrapper) {
  box-shadow: none;
  padding: 0;
  background: transparent;
}

/* 图片上传 */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.upload-box {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  background: #fafafa;
}

.upload-box:hover {
  border-color: #4a90d9;
}

.upload-box.empty {
  cursor: default;
  background: #f5f6fa;
}

.upload-plus {
  font-size: 28px;
  color: #9ca3af;
}

.upload-hint {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

/* ===== D. 专属字段 ===== */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
}

.switch-label {
  font-size: 13px;
  color: #9ca3af;
}

/* ===== E. 底部操作栏 ===== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: 500;
}
</style>
