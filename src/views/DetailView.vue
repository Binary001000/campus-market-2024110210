<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Star, StarFilled, ChatLineSquare } from '@element-plus/icons-vue'

const route = useRoute()
const itemId = route.params.id as string

interface ItemDetail {
  title: string
  price: number
  originalPrice?: number
  type: string
  campus: string
  location: string
  status: string
  desc: string
  seller: string
  college: string
  time: string
  tags: string[]
  viewCount: number
  condition?: string
  allowBargain?: boolean
}

const itemMap: Record<string, ItemDetail> = {
  '1': { title: '《数据结构》教材 9成新', price: 25, originalPrice: 45, type: '二手交易', campus: '北校区', location: '图书馆门口', status: '进行中', desc: '数据结构教材，几乎全新，仅有少量笔记。适合计算机专业同学使用，内容完整无缺页。', seller: '张同学', college: '计算机学院', time: '2026-06-28', tags: ['教材', '九成新', '计算机'], viewCount: 86, condition: '九成新', allowBargain: true },
  '2': { title: '机械键盘 Cherry 青轴', price: 180, originalPrice: 350, type: '二手交易', campus: '南校区', location: '宿舍3号楼', status: '进行中', desc: 'Cherry 青轴机械键盘，87键紧凑布局，使用半年左右，手感非常好。配件齐全，原装键帽+拔键器都在。', seller: '李同学', college: '信息学院', time: '2026-06-27', tags: ['键盘', 'Cherry', '机械'], viewCount: 64, condition: '七成新', allowBargain: true },
  '3': { title: '台灯 LED 护眼', price: 35, originalPrice: 68, type: '二手交易', campus: '北校区', location: '教学楼A座', status: '已完成', desc: 'LED 护眼台灯，三档亮度可调，无频闪不伤眼，宿舍学习必备。底座稳固，可调节角度。', seller: '王同学', college: '文学院', time: '2026-06-27', tags: ['台灯', 'LED', '护眼'], viewCount: 38, condition: '九成新', allowBargain: false },
  '4': { title: '四级词汇书（赠笔记）', price: 15, type: '二手交易', campus: '东校区', location: '食堂门口', status: '进行中', desc: '四级词汇书，已顺利通过四级考试，赠送详细复习笔记和重点标注。', seller: '赵同学', college: '外语学院', time: '2026-06-26', tags: ['四级', '词汇', '英语'], viewCount: 51, condition: '七成新', allowBargain: true },
  '5': { title: 'iPad 保护壳 全新', price: 28, originalPrice: 59, type: '二手交易', campus: '西校区', location: '宿舍7号楼', status: '进行中', desc: 'iPad Pro 11寸保护壳，买错了型号所以转让，全新未拆封，包装完好。', seller: '陈同学', college: '艺术学院', time: '2026-06-26', tags: ['iPad', '保护壳', '全新'], viewCount: 23, condition: '全新', allowBargain: false },
  '6': { title: '瑜伽垫 加厚防滑', price: 45, type: '二手交易', campus: '南校区', location: '体育馆', status: '进行中', desc: '加厚防滑瑜伽垫，尺寸 183×61cm，厚度6mm。只用过几次，适合宿舍锻炼。', seller: '刘同学', college: '体育学院', time: '2026-06-25', tags: ['瑜伽', '运动', '加厚'], viewCount: 42, condition: '九成新', allowBargain: true },
  '7': { title: '蓝牙耳机 降噪版', price: 120, originalPrice: 299, type: '二手交易', campus: '北校区', location: '图书馆', status: '进行中', desc: '主动降噪蓝牙耳机，续航30小时，音质出色，佩戴舒适。配件包含充电盒+备用耳塞。', seller: '周同学', college: '信息学院', time: '2026-06-25', tags: ['耳机', '蓝牙', '降噪'], viewCount: 51, condition: '八成新', allowBargain: true },
  '8': { title: '考研英语真题集', price: 20, type: '二手交易', campus: '东校区', location: '自习室', status: '已完成', desc: '考研英语历年真题详解，含详细解析和答题技巧，助你高效备考。', seller: '吴同学', college: '研究生院', time: '2026-06-24', tags: ['考研', '英语', '真题'], viewCount: 33, condition: '七成新', allowBargain: false },
}

const item = itemMap[itemId]
const isFavorited = ref(false)
const bargainPrice = ref<number | undefined>(undefined)

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
}

const typeTagColor = (type: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '二手交易': '', '失物招领': 'warning', '拼单搭子': 'success', '跑腿委托': 'danger',
  }
  return map[type] || ''
}

const handleBargain = () => {
  if (bargainPrice.value && bargainPrice.value > 0) {
    // 静态模拟：后续接消息中心
  }
}
</script>

<template>
  <div class="detail-page">
    <!-- A. 面包屑 -->
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/list' }">集市</el-breadcrumb-item>
      <el-breadcrumb-item>{{ item?.title || '商品详情' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 存在时 -->
    <template v-if="item">
      <!-- B. 主体卡片 -->
      <el-card class="main-card">
        <div class="main-layout">
          <!-- 左侧图片 -->
          <div class="main-thumb">
            <span class="thumb-icon">📷</span>
          </div>
          <!-- 右侧信息 -->
          <div class="main-info">
            <h2 class="info-title">{{ item.title }}</h2>
            <div class="info-price-row">
              <span class="info-price">¥{{ item.price }}</span>
              <span v-if="item.originalPrice" class="info-original">¥{{ item.originalPrice }}</span>
            </div>
            <div class="info-tags">
              <el-tag :type="typeTagColor(item.type)" size="small">{{ item.type }}</el-tag>
              <el-tag type="info" size="small" effect="plain">{{ item.campus }}</el-tag>
              <el-tag :type="item.status === '进行中' ? 'success' : 'info'" size="small" effect="plain">{{ item.status }}</el-tag>
            </div>
            <div class="info-publisher">
              <div class="pub-avatar">👤</div>
              <div class="pub-detail">
                <span class="pub-name">{{ item.seller }}</span>
                <span class="pub-college">{{ item.college }}</span>
              </div>
            </div>
            <div class="info-extra">
              <span>🕒 {{ item.time }}</span>
              <span>👁️ {{ item.viewCount }} 次浏览</span>
            </div>
            <div class="info-actions">
              <el-button
                :type="isFavorited ? 'danger' : 'default'"
                :icon="isFavorited ? StarFilled : Star"
                @click="toggleFavorite"
                round
              >
                {{ isFavorited ? '已收藏' : '收藏' }}
              </el-button>
              <el-button type="primary" :icon="ChatLineSquare" round>
                联系卖家
              </el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- C. 详情描述 -->
        <div class="desc-section">
          <h3>商品描述</h3>
          <p class="desc-text">{{ item.desc }}</p>
          <div class="desc-meta">
            <div class="meta-item">
              <span class="meta-label">交易地点</span>
              <span class="meta-value">📍 {{ item.location }}</span>
            </div>
            <div class="meta-item" v-if="item.condition">
              <span class="meta-label">成色</span>
              <span class="meta-value">{{ item.condition }}</span>
            </div>
          </div>
          <div class="desc-tags">
            <el-tag v-for="t in item.tags" :key="t" size="small" class="tag-item">{{ t }}</el-tag>
          </div>
        </div>
      </el-card>

      <!-- D. 模拟砍价（仅二手+允许砍价） -->
      <el-card v-if="item.type === '二手交易' && item.allowBargain" class="bargain-card">
        <div class="bargain-header">
          <span class="bargain-icon">💬</span>
          <span class="bargain-title">想要更优惠？</span>
        </div>
        <div class="bargain-body">
          <el-input-number
            v-model="bargainPrice"
            :min="1"
            :max="item.price - 1"
            placeholder="输入你的出价"
            size="large"
            class="bargain-input"
          />
          <el-button type="warning" size="large" @click="handleBargain" round>
            出价
          </el-button>
        </div>
        <p class="bargain-hint">卖家可能会接受或还价，出价将写入消息记录</p>
      </el-card>

      <!-- E. 底部操作栏 -->
      <div class="bottom-bar">
        <el-button
          :type="isFavorited ? 'danger' : 'default'"
          :icon="isFavorited ? StarFilled : Star"
          @click="toggleFavorite"
          round
        >
          {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
        <el-button type="primary" size="large" :icon="ChatLineSquare" round>
          联系卖家
        </el-button>
      </div>

      <div class="item-id">商品编号：#{{ itemId }}</div>
    </template>

    <!-- F. 不存在 -->
    <el-result
      v-else
      icon="warning"
      title="商品不存在"
      sub-title="该商品可能已下架或删除"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/list')">返回集市</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 800px;
}

/* ===== 面包屑 ===== */
.breadcrumb {
  margin-bottom: 16px;
  font-size: 13px;
}

/* ===== B. 主体卡片 ===== */
.main-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.main-layout {
  display: flex;
  gap: 24px;
}

.main-thumb {
  width: 320px;
  height: 240px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumb-icon {
  font-size: 48px;
  opacity: 0.35;
}

.main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.3;
}

.info-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.info-price {
  font-size: 32px;
  font-weight: 700;
  color: #ff6b3d;
}

.info-original {
  font-size: 16px;
  color: #9ca3af;
  text-decoration: line-through;
}

.info-tags {
  display: flex;
  gap: 6px;
}

.info-publisher {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pub-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.pub-detail {
  display: flex;
  flex-direction: column;
}

.pub-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.pub-college {
  font-size: 12px;
  color: #9ca3af;
}

.info-extra {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9ca3af;
}

.info-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

/* ===== C. 描述区 ===== */
.desc-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #1a1a2e;
}

.desc-text {
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  margin: 0 0 16px;
}

.desc-meta {
  display: flex;
  gap: 32px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.meta-label {
  font-size: 13px;
  color: #9ca3af;
}

.meta-value {
  font-size: 14px;
  color: #374151;
}

.desc-tags {
  display: flex;
  gap: 6px;
}

/* ===== D. 砍价区 ===== */
.bargain-card {
  border-radius: 12px;
  margin-bottom: 80px;
  background: #fff9f0;
  border-color: #fef0e5;
}

.bargain-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.bargain-icon {
  font-size: 20px;
}

.bargain-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.bargain-body {
  display: flex;
  gap: 12px;
  align-items: center;
}

.bargain-input {
  width: 220px;
}

.bargain-hint {
  margin: 10px 0 0;
  font-size: 12px;
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
  justify-content: center;
  gap: 12px;
  z-index: 500;
}

.item-id {
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 8px;
  padding-bottom: 80px;
}
</style>
