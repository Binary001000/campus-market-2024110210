<script setup lang="ts">
// 消息中心 — 左右双栏布局（会话列表 + 聊天区），纯前端 Mock 数据
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 会话列表数据（Mock）
const conversations = [
  { id: 1, user: '张同学', college: '计算机学院', lastMsg: '好的，图书馆门口见', time: '10:30', unread: 2, item: '《数据结构》教材' },
  { id: 2, user: '李同学', college: '信息学院', lastMsg: '可以便宜点吗？最低多少出？', time: '昨天', unread: 0, item: '机械键盘' },
  { id: 3, user: '王同学', college: '文学院', lastMsg: '还在吗？我想看看实物', time: '昨天', unread: 1, item: '台灯 LED 护眼' },
  { id: 4, user: '赵同学', college: '外语学院', lastMsg: '好的谢谢', time: '周二', unread: 0, item: '四级词汇书' },
  { id: 5, user: '刘同学', college: '体育学院', lastMsg: '周末有空来拿', time: '周一', unread: 0, item: '瑜伽垫' },
]

const convSearch = ref('')          // 会话搜索关键字
const activeConv = ref(conversations[0])  // 当前选中的会话

// 根据搜索关键字过滤会话
const filteredConvs = computed(() => {
  if (!convSearch.value) return conversations
  const q = convSearch.value.toLowerCase()
  return conversations.filter(c =>
    c.user.includes(q) || c.item.includes(q) || c.lastMsg.includes(q)
  )
})

// 消息内容数据（按会话 id 索引）
const messagesMap: Record<number, { from: string; text: string; time: string }[]> = {
  1: [
    { from: 'other', text: '你好，请问教材还在吗？', time: '10:15' },
    { from: 'me', text: '在的！很新的', time: '10:16' },
    { from: 'other', text: '可以看一下图片吗', time: '10:18' },
    { from: 'me', text: '好的，我发给你', time: '10:20' },
    { from: 'system', text: '以上为历史消息', time: '' },
    { from: 'other', text: '好的，图书馆门口见', time: '10:30' },
  ],
  2: [
    { from: 'other', text: '你好，请问键盘还在吗？', time: '昨天 15:20' },
    { from: 'me', text: '在的，可以来宿舍看', time: '昨天 15:22' },
    { from: 'other', text: '可以便宜点吗？', time: '昨天 15:23' },
    { from: 'me', text: '最低 160，已经很划算了', time: '昨天 15:25' },
  ],
  3: [
    { from: 'other', text: '台灯还在吗？', time: '昨天 20:10' },
    { from: 'me', text: '在的', time: '昨天 20:12' },
    { from: 'other', text: '还在吗？我想看看实物', time: '昨天 21:05' },
  ],
}

const currentMessages = computed(() => {
  if (!activeConv.value) return []
  return messagesMap[activeConv.value.id] || []
})

const newMsg = ref('')  // 输入框消息内容

// 根据用户名字哈希生成彩色头像背景色
const avatarColor = (name: string): string => {
  const colors = ['#4a90d9', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) | 0
  return colors[Math.abs(hash) % colors.length]!
}

const getInitial = (name: string) => name.charAt(0)

// 发送消息：追加到当前会话的消息列表
const handleSend = () => {
  const conv = activeConv.value
  if (newMsg.value.trim() && conv) {
    if (!messagesMap[conv.id]) {
      messagesMap[conv.id] = []
    }
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    messagesMap[conv.id]!.push({
      from: 'me',
      text: newMsg.value.trim(),
      time,
    })
    newMsg.value = ''
  }
}
</script>

<template>
  <div class="message-page">
    <h2 class="page-title">消息中心</h2>

    <div class="message-layout">
      <!-- 左侧会话列表 -->
      <div class="conv-panel">
        <div class="conv-search">
          <el-input
            v-model="convSearch"
            placeholder="搜索会话"
            :prefix-icon="Search"
            size="small"
            clearable
          />
        </div>
        <div class="conv-list">
          <div
            v-for="c in filteredConvs"
            :key="c.id"
            class="conv-item"
            :class="{ active: activeConv?.id === c.id }"
            @click="activeConv = c"
          >
            <div class="conv-avatar" :style="{ background: avatarColor(c.user) }">
              {{ getInitial(c.user) }}
            </div>
            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-name">{{ c.user }}</span>
                <span class="conv-time">{{ c.time }}</span>
              </div>
              <div class="conv-bottom">
                <span class="conv-msg">{{ c.lastMsg }}</span>
                <el-badge v-if="c.unread" :value="c.unread" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区 -->
      <div class="chat-panel">
        <template v-if="activeConv">
          <div class="chat-header">
            <div class="chat-header-avatar" :style="{ background: avatarColor(activeConv.user) }">
              {{ getInitial(activeConv.user) }}
            </div>
            <div class="chat-header-info">
              <span class="chat-header-name">{{ activeConv.user }}</span>
              <span class="chat-header-college">{{ activeConv.college }}</span>
            </div>
            <span class="chat-header-item">关于：{{ activeConv.item }}</span>
          </div>

          <div class="chat-messages" ref="msgContainer">
            <div
              v-for="m in currentMessages"
              :key="m.time + m.text"
              class="msg-row"
              :class="{
                'msg-row-me': m.from === 'me',
                'msg-row-other': m.from === 'other',
                'msg-row-system': m.from === 'system',
              }"
            >
              <template v-if="m.from === 'system'">
                <span class="system-tag">{{ m.text }}</span>
              </template>
              <template v-else>
                <div class="msg-bubble" :class="m.from === 'me' ? 'bubble-me' : 'bubble-other'">
                  {{ m.text }}
                </div>
                <div class="msg-time">{{ m.time }}</div>
              </template>
            </div>
          </div>

          <div class="chat-input-area">
            <el-input
              v-model="newMsg"
              placeholder="输入消息..."
              :rows="2"
              type="textarea"
              resize="none"
              @keydown.enter.exact.prevent="handleSend"
            />
            <div class="chat-actions">
              <span class="input-hint">Enter 发送</span>
              <el-button type="primary" :disabled="!newMsg.trim()" @click="handleSend">
                发送
              </el-button>
            </div>
          </div>
        </template>

        <div v-else class="chat-empty">
          <span class="empty-icon">💬</span>
          <p>选择一个会话开始聊天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-page {
  max-width: 960px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 16px;
}

/* ===== 布局 ===== */
.message-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  height: 560px;
  background: #ffffff;
}

/* ===== 左侧会话列表 ===== */
.conv-panel {
  border-right: 1px solid #f0f0f0;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
}

.conv-search {
  padding: 12px;
}

.conv-search :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #ffffff;
}

.conv-list {
  flex: 1;
  overflow-y: auto;
}

.conv-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}

.conv-item:hover {
  background: #f0f5ff;
}

.conv-item.active {
  background: #eff6ff;
  border-left: 3px solid #4a90d9;
  padding-left: 13px;
}

.conv-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.conv-time {
  font-size: 10px;
  color: #c0c4cc;
  flex-shrink: 0;
}

.conv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-msg {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
}

/* ===== 右侧聊天区 ===== */
.chat-panel {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.chat-header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.chat-header-info {
  flex: 1;
}

.chat-header-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.chat-header-college {
  font-size: 11px;
  color: #9ca3af;
  display: block;
}

.chat-header-item {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* 消息区 */
.chat-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafbfc;
}

.msg-row {
  display: flex;
  flex-direction: column;
  max-width: 72%;
}

.msg-row-me {
  align-self: flex-end;
  align-items: flex-end;
}

.msg-row-other {
  align-self: flex-start;
  align-items: flex-start;
}

.msg-row-system {
  align-self: center;
  align-items: center;
  margin: 8px 0;
}

.system-tag {
  font-size: 11px;
  color: #9ca3af;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 10px;
}

.msg-bubble {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.55;
  word-break: break-word;
  border-radius: 14px;
}

.bubble-me {
  background: #4a90d9;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.bubble-other {
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 10px;
  color: #c0c4cc;
  margin-top: 3px;
  padding: 0 4px;
}

/* 输入区 */
.chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;
  flex-shrink: 0;
}

.chat-input-area :deep(.el-textarea__inner) {
  border-radius: 10px;
  background: #f5f6fa;
  resize: none;
}

.chat-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.input-hint {
  font-size: 11px;
  color: #c0c4cc;
}

/* 空状态 */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  gap: 8px;
}

.empty-icon {
  font-size: 48px;
}

.chat-empty p {
  font-size: 14px;
  margin: 0;
}
</style>
