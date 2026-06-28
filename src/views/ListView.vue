<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

interface ListItem {
  id: number
  title: string
  desc: string
  price: number
  type: string
  campus: string
  status: string
  time: string
}

const items: ListItem[] = [
  { id: 1, title: '《数据结构》教材 9成新', desc: '几乎全新，仅有少量笔记，适合计算机专业', price: 25, type: '二手交易', campus: '北校区', status: '进行中', time: '10 分钟前' },
  { id: 2, title: '机械键盘 Cherry 青轴', desc: '87键，使用半年，手感很好，配件齐全', price: 180, type: '二手交易', campus: '南校区', status: '进行中', time: '25 分钟前' },
  { id: 3, title: '台灯 LED 护眼', desc: '三档亮度可调，无频闪，宿舍学习必备', price: 35, type: '二手交易', campus: '北校区', status: '已完成', time: '1 小时前' },
  { id: 4, title: '四级词汇书（赠笔记）', desc: '已过四级，赠送详细复习笔记', price: 15, type: '二手交易', campus: '东校区', status: '进行中', time: '2 小时前' },
  { id: 5, title: 'iPad 保护壳 全新', desc: 'iPad Pro 11寸，买错型号未拆封', price: 28, type: '二手交易', campus: '西校区', status: '进行中', time: '3 小时前' },
  { id: 6, title: '瑜伽垫 加厚防滑', desc: '183×61cm，只用过几次，适合宿舍', price: 45, type: '二手交易', campus: '南校区', status: '进行中', time: '4 小时前' },
  { id: 7, title: '蓝牙耳机 降噪版', desc: '主动降噪，续航30小时，音质出色', price: 120, type: '二手交易', campus: '北校区', status: '进行中', time: '5 小时前' },
  { id: 8, title: '考研英语真题集', desc: '历年真题详解，含详细解析和答题技巧', price: 20, type: '二手交易', campus: '东校区', status: '已完成', time: '6 小时前' },
]

const typeOptions = ['全部', '二手交易', '失物招领', '拼单搭子', '跑腿委托']
const campusOptions = ['全部校区', '北校区', '南校区', '东校区', '西校区']
const sortOptions = ['最新发布', '价格↑', '价格↓', '最热门']
const statusOptions = ['全部状态', '进行中', '已完成', '已关闭']

const searchQuery = ref('')
const selectedType = ref('全部')
const selectedCampus = ref('全部校区')
const selectedSort = ref('最新发布')
const selectedStatus = ref('全部状态')
const currentPage = ref(1)
const pageSize = 4

const filteredItems = computed(() => {
  let result = [...items]
  if (searchQuery.value) {
    result = result.filter(i => i.title.includes(searchQuery.value))
  }
  if (selectedType.value !== '全部') {
    result = result.filter(i => i.type === selectedType.value)
  }
  if (selectedCampus.value !== '全部校区') {
    result = result.filter(i => i.campus === selectedCampus.value)
  }
  if (selectedStatus.value !== '全部状态') {
    result = result.filter(i => i.status === selectedStatus.value)
  }
  if (selectedSort.value === '价格↑') {
    result.sort((a, b) => a.price - b.price)
  } else if (selectedSort.value === '价格↓') {
    result.sort((a, b) => b.price - a.price)
  }
  return result
})

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const typeTagColor = (type: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '二手交易': '', '失物招领': 'warning', '拼单搭子': 'success', '跑腿委托': 'danger',
  }
  return map[type] || ''
}
</script>

<template>
  <div class="list-page">
    <!-- A. 筛选栏（sticky） -->
    <div class="filter-bar">
      <el-card shadow="never" class="filter-card">
        <div class="filter-row">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品、失物、拼单..."
            :prefix-icon="Search"
            class="filter-search"
            clearable
          />
          <el-select v-model="selectedType" class="filter-select">
            <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
          </el-select>
          <el-select v-model="selectedCampus" class="filter-select">
            <el-option v-for="c in campusOptions" :key="c" :label="c" :value="c" />
          </el-select>
          <el-select v-model="selectedStatus" class="filter-select">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
          <el-select v-model="selectedSort" class="filter-select-sort">
            <el-option v-for="s in sortOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
      </el-card>
    </div>

    <!-- B. 卡片列表 -->
    <div v-if="pagedItems.length" class="item-list">
      <RouterLink
        v-for="item in pagedItems"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="item-link"
      >
        <el-card shadow="hover" class="item-card">
          <div class="item-layout">
            <!-- 图片占位 -->
            <div class="item-thumb">
              <span class="thumb-icon">📷</span>
            </div>
            <!-- 信息区 -->
            <div class="item-body">
              <div class="item-top">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-price">¥{{ item.price }}</span>
              </div>
              <p class="item-desc">{{ item.desc }}</p>
              <div class="item-bottom">
                <div class="item-tags">
                  <el-tag :type="typeTagColor(item.type)" size="small">{{ item.type }}</el-tag>
                  <el-tag type="info" size="small" effect="plain">{{ item.campus }}</el-tag>
                  <span :class="['status-dot', item.status === '进行中' ? 'active' : 'done']"></span>
                  <span class="status-text">{{ item.status }}</span>
                </div>
                <span class="item-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </RouterLink>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="还没有相关信息，去发布第一条吧～">
      <RouterLink to="/publish">
        <el-button type="primary">去发布</el-button>
      </RouterLink>
    </el-empty>

    <!-- C. 分页 -->
    <div v-if="filteredItems.length > pageSize" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredItems.length"
        layout="prev, pager, next"
        background
        size="small"
      />
    </div>

    <!-- 回到顶部 -->
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<style scoped>
.list-page {
  max-width: 900px;
}

/* ===== A. 筛选栏 ===== */
.filter-bar {
  position: sticky;
  top: 56px;
  z-index: 100;
  margin-bottom: 16px;
}

.filter-card {
  border-radius: 12px;
}

.filter-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.filter-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-search {
  width: 240px;
}

.filter-search :deep(.el-input__wrapper) {
  border-radius: 24px;
}

.filter-select {
  width: 110px;
}

.filter-select-sort {
  width: 120px;
}

/* ===== B. 卡片 ===== */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-link {
  text-decoration: none;
  color: inherit;
}

.item-card {
  border-radius: 12px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.item-card:hover {
  border-left-color: #4a90d9;
  transform: translateX(2px);
}

.item-layout {
  display: flex;
  gap: 16px;
}

.item-thumb {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumb-icon {
  font-size: 28px;
  opacity: 0.4;
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b3d;
  flex-shrink: 0;
}

.item-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.active {
  background: #22c55e;
}

.status-dot.done {
  background: #9ca3af;
}

.status-text {
  font-size: 12px;
  color: #9ca3af;
}

.item-time {
  font-size: 12px;
  color: #c0c4cc;
  flex-shrink: 0;
}

/* ===== 分页 ===== */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
