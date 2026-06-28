<script setup lang="ts">
import { ref } from 'vue'

const infoType = ref('secondhand')

const campuses = ['北校区', '南校区', '东校区', '西校区']
</script>

<template>
  <div class="publish-page">
    <h2>发布信息</h2>

    <el-card class="publish-card">
      <!-- 信息类型选择 -->
      <div class="form-section">
        <label class="form-label">信息类型</label>
        <el-radio-group v-model="infoType" size="large">
          <el-radio-button value="secondhand">🛒 二手交易</el-radio-button>
          <el-radio-button value="lostfound">🔍 失物招领</el-radio-button>
          <el-radio-button value="group">👥 拼单搭子</el-radio-button>
          <el-radio-button value="errand">🏃 跑腿委托</el-radio-button>
        </el-radio-group>
      </div>

      <el-divider />

      <!-- 通用字段 -->
      <div class="form-section">
        <label class="form-label">标题</label>
        <el-input placeholder="请输入信息标题" maxlength="50" show-word-limit />
      </div>

      <el-row :gutter="16">
        <el-col :span="12">
          <div class="form-section">
            <label class="form-label">校区</label>
            <el-select placeholder="请选择校区" style="width: 100%">
              <el-option v-for="c in campuses" :key="c" :label="c" :value="c" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="form-section">
            <label class="form-label">交易地点</label>
            <el-input placeholder="如：图书馆门口" />
          </div>
        </el-col>
      </el-row>

      <div class="form-section">
        <label class="form-label">详细描述</label>
        <el-input type="textarea" :rows="4" placeholder="请描述物品特征、成色、使用情况等" maxlength="500" show-word-limit />
      </div>

      <div class="form-section">
        <label class="form-label">标签</label>
        <el-input placeholder="如：教材, 二手, 九成新（用逗号分隔）" />
      </div>

      <el-divider />

      <!-- 类型专属字段 -->
      <!-- 二手交易 -->
      <template v-if="infoType === 'secondhand'">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">价格 (¥)</label>
              <el-input placeholder="0.00" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">成色</label>
              <el-select placeholder="请选择" style="width: 100%">
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
              <div style="padding-top: 6px">
                <el-switch />
              </div>
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 失物招领 -->
      <template v-if="infoType === 'lostfound'">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">类型</label>
              <el-radio-group>
                <el-radio value="lost">丢失物品</el-radio>
                <el-radio value="found">拾获物品</el-radio>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">发生时间</label>
              <el-input placeholder="如：2026-06-28 上午" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">物品特征</label>
              <el-input placeholder="颜色/品牌/特殊标记" />
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 拼单搭子 -->
      <template v-if="infoType === 'group'">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">目标人数</label>
              <el-input-number :min="2" :max="99" style="width: 100%" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">当前人数</label>
              <el-input-number :min="1" :max="99" style="width: 100%" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">截止时间</label>
              <el-input placeholder="如：2026-06-30" />
            </div>
          </el-col>
        </el-row>
      </template>

      <!-- 跑腿委托 -->
      <template v-if="infoType === 'errand'">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">酬劳 (¥)</label>
              <el-input placeholder="0.00" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">任务地点</label>
              <el-input placeholder="如：菜鸟驿站" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="form-section">
              <label class="form-label">期望完成时间</label>
              <el-input placeholder="如：2026-06-28 18:00" />
            </div>
          </el-col>
        </el-row>
      </template>

      <el-divider />

      <div class="form-actions">
        <el-button>保存草稿</el-button>
        <el-button type="primary" size="large">发布信息</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.publish-page {
  max-width: 800px;
}

.publish-card {
  margin-top: 16px;
}

.form-section {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
