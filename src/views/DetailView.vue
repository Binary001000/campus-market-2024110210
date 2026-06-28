<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const itemId = route.params.id as string

const itemMap: Record<string, { title: string; price: number; category: string; desc: string; seller: string; time: string }> = {
  '1': { title: '《数据结构》教材 9成新', price: 25, category: '教材教辅', desc: '数据结构教材，几乎全新，仅有少量笔记。适合计算机专业同学使用。', seller: '计算机学院 张同学', time: '2026-06-28' },
  '2': { title: '机械键盘 Cherry 青轴', price: 180, category: '电子产品', desc: 'Cherry 青轴机械键盘，87键，使用半年，手感很好，配件齐全。', seller: '信息学院 李同学', time: '2026-06-27' },
  '3': { title: '台灯 LED 护眼', price: 35, category: '生活用品', desc: 'LED 护眼台灯，三档亮度可调，无频闪，宿舍学习必备。', seller: '文学院 王同学', time: '2026-06-27' },
  '4': { title: '四级词汇书（赠笔记）', price: 15, category: '教材教辅', desc: '四级词汇书，已过四级，赠送详细复习笔记。', seller: '外语学院 赵同学', time: '2026-06-26' },
  '5': { title: 'iPad 保护壳 全新', price: 28, category: '电子产品', desc: 'iPad Pro 11寸保护壳，买错了型号，全新未拆封。', seller: '艺术学院 陈同学', time: '2026-06-26' },
  '6': { title: '瑜伽垫 加厚防滑', price: 45, category: '运动户外', desc: '加厚防滑瑜伽垫，尺寸 183×61cm，只用过几次。', seller: '体育学院 刘同学', time: '2026-06-25' },
  '7': { title: '蓝牙耳机 降噪版', price: 120, category: '电子产品', desc: '主动降噪蓝牙耳机，续航 30 小时，音质出色。', seller: '信息学院 周同学', time: '2026-06-25' },
  '8': { title: '考研英语真题集', price: 20, category: '教材教辅', desc: '考研英语历年真题详解，含详细解析和答题技巧。', seller: '研究生院 吴同学', time: '2026-06-24' },
}

const item = itemMap[itemId]

const categoryType = (cat: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '教材教辅': '',
    '电子产品': 'success',
    '生活用品': 'warning',
    '运动户外': 'danger',
  }
  return map[cat] || ''
}
</script>

<template>
  <div class="detail-page">
    <el-button text @click="$router.push('/list')">← 返回列表</el-button>

    <el-card v-if="item" class="detail-card">
      <h2>{{ item.title }}</h2>
      <div class="detail-meta">
        <el-tag :type="categoryType(item.category)" size="small">{{ item.category }}</el-tag>
        <span>发布于 {{ item.time }}</span>
      </div>
      <div class="detail-price">¥{{ item.price }}</div>

      <el-divider />

      <div class="detail-section">
        <h4>商品描述</h4>
        <p>{{ item.desc }}</p>
      </div>

      <el-divider />

      <div class="detail-section">
        <h4>卖家信息</h4>
        <p>{{ item.seller }}</p>
      </div>

      <el-divider />

      <div class="detail-footer">
        <span class="detail-id">商品编号：{{ itemId }}</span>
        <el-button type="primary">联系卖家</el-button>
      </div>
    </el-card>

    <el-result
      v-else
      icon="warning"
      title="商品不存在"
      sub-title="该商品可能已下架或删除"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/list')">返回列表</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 680px;
}

.detail-card h2 {
  margin: 0 0 12px;
  font-size: 20px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.detail-price {
  font-size: 28px;
  font-weight: 700;
  color: #f56c6c;
}

.detail-section {
  margin: 4px 0;
}

.detail-section h4 {
  font-size: 14px;
  color: #909399;
  margin: 0 0 6px;
}

.detail-section p {
  font-size: 15px;
  color: #303133;
  margin: 0;
  line-height: 1.6;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-id {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
