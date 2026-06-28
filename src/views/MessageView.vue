<script setup lang="ts">
import { ref } from 'vue'

const conversations = [
  { id: 1, user: '计算机学院 张同学', avatar: '👤', lastMsg: '好的，图书馆门口见', time: '10:30', unread: 2, item: '《数据结构》教材' },
  { id: 2, user: '信息学院 李同学', avatar: '👤', lastMsg: '可以便宜点吗？', time: '昨天', unread: 0, item: '机械键盘' },
  { id: 3, user: '文学院 王同学', avatar: '👤', lastMsg: '还在吗？我想看看', time: '昨天', unread: 1, item: '台灯 LED' },
]

const activeConv = ref(conversations[0])

const messages = [
  { id: 1, from: 'other', text: '你好，请问键盘还在吗？', time: '昨天 15:20' },
  { id: 2, from: 'me', text: '在的，可以来宿舍看', time: '昨天 15:22' },
  { id: 3, from: 'other', text: '可以便宜点吗？', time: '昨天 15:23' },
  { id: 4, from: 'me', text: '最低 160，已经很划算了', time: '昨天 15:25' },
]

const newMsg = ref('')
</script>

<template>
  <div class="message-page">
    <h2>消息中心</h2>

    <div class="message-layout">
      <!-- 会话列表 -->
      <div class="conv-panel">
        <div class="conv-list">
          <div
            v-for="c in conversations"
            :key="c.id"
            class="conv-item"
            :class="{ active: activeConv?.id === c.id }"
            @click="activeConv = c"
          >
            <div class="conv-avatar">{{ c.avatar }}</div>
            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-name">{{ c.user }}</span>
                <span class="conv-time">{{ c.time }}</span>
              </div>
              <div class="conv-bottom">
                <span class="conv-msg">{{ c.lastMsg }}</span>
                <el-badge v-if="c.unread" :value="c.unread" class="conv-badge" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天区 -->
      <div class="chat-panel">
        <template v-if="activeConv">
          <div class="chat-header">
            <span>{{ activeConv.user }}</span>
            <span class="chat-subtitle">关于：{{ activeConv.item }}</span>
          </div>

          <div class="chat-messages">
            <div
              v-for="m in messages"
              :key="m.id"
              class="msg-bubble"
              :class="m.from === 'me' ? 'msg-me' : 'msg-other'"
            >
              <div class="msg-text">{{ m.text }}</div>
              <div class="msg-time">{{ m.time }}</div>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="newMsg"
              placeholder="输入消息..."
              :rows="2"
              type="textarea"
            />
            <el-button type="primary" size="small" style="margin-top: 8px">发送</el-button>
          </div>
        </template>

        <div v-else class="chat-empty">
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

.message-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  margin-top: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  height: 520px;
}

/* 会话列表 */
.conv-panel {
  border-right: 1px solid #e8e8e8;
  background: #fafafa;
  overflow-y: auto;
}

.conv-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}

.conv-item:hover,
.conv-item.active {
  background: #fff;
}

.conv-avatar {
  font-size: 28px;
  flex-shrink: 0;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 14px;
  font-weight: 500;
}

.conv-time {
  font-size: 11px;
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
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* 聊天区 */
.chat-panel {
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-header {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  font-weight: 500;
}

.chat-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
  margin-left: 8px;
}

.chat-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-bubble {
  max-width: 70%;
}

.msg-me {
  align-self: flex-end;
  text-align: right;
}

.msg-other {
  align-self: flex-start;
}

.msg-text {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.msg-me .msg-text {
  background: #1890ff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-other .msg-text {
  background: #f0f0f0;
  color: #303133;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.chat-input {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.chat-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}
</style>
