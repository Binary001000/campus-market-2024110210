<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const itemId = route.params.id as string

// 模拟详情数据（按 id 匹配）
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
</script>

<template>
  <div class="detail-page">
    <RouterLink to="/list" class="back-link">← 返回列表</RouterLink>

    <div v-if="item" class="detail-card">
      <h2>{{ item.title }}</h2>
      <div class="detail-meta">
        <span class="tag">{{ item.category }}</span>
        <span>发布于 {{ item.time }}</span>
      </div>
      <div class="detail-price">¥{{ item.price }}</div>
      <div class="detail-section">
        <h3>商品描述</h3>
        <p>{{ item.desc }}</p>
      </div>
      <div class="detail-section">
        <h3>卖家信息</h3>
        <p>{{ item.seller }}</p>
      </div>
      <div class="detail-id">商品编号：{{ itemId }}</div>
    </div>

    <div v-else class="empty">
      <p>商品不存在</p>
      <RouterLink to="/list">返回列表</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 640px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 24px;
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
  color: #999;
  margin-bottom: 16px;
}

.tag {
  background: #f0f5ff;
  color: #1890ff;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.detail-price {
  font-size: 28px;
  font-weight: 700;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h3 {
  font-size: 14px;
  color: #999;
  margin: 0 0 6px;
}

.detail-section p {
  font-size: 15px;
  color: #333;
  margin: 0;
  line-height: 1.6;
}

.detail-id {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #ccc;
}

.empty {
  text-align: center;
  padding: 48px;
  color: #999;
}
</style>
