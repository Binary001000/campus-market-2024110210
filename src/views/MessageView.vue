<template>
  <div class="message-page">
    <div class="page-header">
      <h1>消息中心</h1>
    </div>

    <div v-if="!userStore.isLoggedIn" class="not-logged-in">
      <div class="icon-wrap">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-4.8 0-8.4 2.1-8.4 4.8v2.4h16.8v-2.4c0-2.7-3.6-4.8-8.4-4.8z"/></svg>
      </div>
      <p class="not-logged-in-text">请先登录后再查看消息</p>
      <el-button type="primary" size="large" @click="openLogin">去登录</el-button>
    </div>

    <div v-else class="message-layout">
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
            @click="selectConversation(c.id)"
          >
            <div class="conv-avatar" :style="{ background: avatarColor(c.peerName || '用户') }">
              {{ getInitial(c.peerName || '用户') }}
            </div>
            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-name">{{ c.peerName || '用户' }}</span>
                <span class="conv-time">{{ c.lastTime.slice(5, 16) }}</span>
              </div>
              <div class="conv-bottom">
                <span class="conv-msg">{{ c.lastMessage }}</span>
                <el-badge v-if="c.unreadCount" :value="c.unreadCount" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-panel">
        <template v-if="activeConv">
          <div class="chat-header">
            <div class="chat-header-avatar" :style="{ background: avatarColor(activeConv.peerName || '用户') }">
              {{ getInitial(activeConv.peerName || '用户') }}
            </div>
            <div class="chat-header-info">
              <span class="chat-header-name">{{ activeConv.peerName || '用户' }}</span>
            </div>
          </div>

          <div class="chat-messages" ref="msgContainer">
            <div
              v-for="(m, i) in currentMessages"
              :key="i"
              class="msg-row"
              :class="{
                'msg-row-me': m.from === 'me',
                'msg-row-other': m.from === 'other',
              }"
            >
              <div class="msg-bubble" :class="m.from === 'me' ? 'bubble-me' : 'bubble-other'">
                {{ m.text }}
              </div>
              <div class="msg-time">{{ m.time }}</div>
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
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="12" width="48" height="36" rx="6" stroke="#c0c4cc" stroke-width="2" fill="none"/>
            <path d="M8 18 L32 34 L56 18" stroke="#c0c4cc" stroke-width="2" stroke-linecap="round"/>
            <circle cx="48" cy="24" r="10" fill="#409eff" opacity="0.15"/>
            <path d="M46 24 L48 26 L51 22" stroke="#409eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>选择一个会话开始聊天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useMessageStore } from '../stores/message'
import { useUserStore } from '../stores/user'
import { getMockReplyAsync } from '../utils/mockReply'

function openLogin() {
  const header = document.querySelector('.app-header')
  if (header) {
    const btn = header.querySelector('.el-button--primary') as HTMLElement
    btn?.click()
  }
}

const route = useRoute()
const messageStore = useMessageStore()
const userStore = useUserStore()

const convSearch = ref('')
const newMsg = ref('')
const msgContainer = ref<HTMLElement | null>(null)

const filteredConvs = computed(() => {
  if (!convSearch.value) return messageStore.conversations
  const q = convSearch.value.toLowerCase()
  return messageStore.conversations.filter(
    (c) => (c.peerName || '').includes(q) || c.lastMessage.includes(q),
  )
})

const activeConv = computed(() => {
  return messageStore.conversations.find((c) => c.id === messageStore.currentConversationId) ?? null
})

const currentMessages = computed(() => {
  return messageStore.messages.map((m) => ({
    from: m.senderId === userStore.currentUser.id ? 'me' as const : 'other' as const,
    text: m.content,
    time: m.createdAt.slice(11, 16),
  }))
})

async function selectConversation(convId: number) {
  await messageStore.loadMessages(convId)
  await messageStore.markAsRead(convId)
  await nextTick()
  scrollToBottom()
}

async function handleSend() {
  const conv = activeConv.value
  if (!newMsg.value.trim() || !conv) return
  const content = newMsg.value.trim()
  newMsg.value = ''

  await messageStore.sendMessage(conv.id, userStore.currentUser.id, content)
  await nextTick()
  scrollToBottom()

  if (conv.participants.length >= 2) {
    const reply = await getMockReplyAsync()
    const otherId = conv.participants.find((p) => p !== userStore.currentUser.id)
    if (otherId == null) return
    await messageStore.sendMessage(conv.id, otherId, reply)
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}

const avatarColor = (name: string): string => {
  const colors = ['var(--color-primary, #409eff)', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) | 0
  return colors[Math.abs(hash) % colors.length]!
}

const getInitial = (name: string) => name.charAt(0)

onMounted(async () => {
  await messageStore.loadConversations()
  const convId = Number(route.query.convId)
  if (convId) {
    await selectConversation(convId)
  }
})

watch(
  () => route.query.convId,
  async (newId) => {
    if (newId) {
      await selectConversation(Number(newId))
    }
  },
)
</script>

<style scoped>
.message-page { max-width: 960px; }

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

.page-header { padding: 24px; border-radius: var(--radius-xl, 16px); background: var(--bg-card, #fff); margin-bottom: 16px; }
.page-header h1 { margin: 0; font-size: 22px; color: var(--text-primary, #111827); }

.message-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-xl, 16px);
  overflow: hidden;
  height: 560px;
  background: var(--bg-card, #ffffff);
}

.conv-panel {
  border-right: 1px solid var(--border-color, #f0f0f0);
  background: var(--bg-secondary, #fafbfc);
  display: flex;
  flex-direction: column;
}

.conv-search { padding: 12px; }
.conv-search :deep(.el-input__wrapper) { border-radius: 20px; background: var(--bg-card, #ffffff); }
.conv-list { flex: 1; overflow-y: auto; }

.conv-item {
  display: flex; gap: 12px; padding: 12px 16px; cursor: pointer;
  border-bottom: 1px solid var(--border-color, #f5f5f5); transition: background 0.15s;
}
.conv-item:hover { background: var(--color-primary-light-9, #f0f5ff); }
.conv-item.active { background: var(--color-primary-light-9, #eff6ff); border-left: 3px solid var(--color-primary, #4a90d9); padding-left: 13px; }

.conv-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff; font-size: 16px; font-weight: 600; flex-shrink: 0;
}

.conv-info { flex: 1; min-width: 0; }
.conv-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.conv-name { font-size: 14px; font-weight: 600; color: var(--text-primary, #1a1a2e); }
.conv-time { font-size: 10px; color: var(--text-tertiary, #c0c4cc); flex-shrink: 0; }
.conv-bottom { display: flex; justify-content: space-between; align-items: center; }
.conv-msg { font-size: 12px; color: var(--text-secondary, #6b7280); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin-right: 8px; }

.chat-panel { display: flex; flex-direction: column; background: var(--bg-card, #fff); }

.chat-header {
  padding: 14px 20px; border-bottom: 1px solid var(--border-color, #f0f0f0);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.chat-header-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff; font-size: 14px; font-weight: 600; flex-shrink: 0;
}
.chat-header-info { flex: 1; }
.chat-header-name { font-size: 15px; font-weight: 600; color: var(--text-primary, #1a1a2e); }

.chat-messages {
  flex: 1; padding: 16px 20px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 8px; background: var(--bg-secondary, #fafbfc);
}

.msg-row { display: flex; flex-direction: column; max-width: 72%; }
.msg-row-me { align-self: flex-end; align-items: flex-end; }
.msg-row-other { align-self: flex-start; align-items: flex-start; }

.msg-bubble { padding: 10px 14px; font-size: 14px; line-height: 1.55; word-break: break-word; border-radius: 14px; }
.bubble-me { background: var(--color-primary, #4a90d9); color: #ffffff; border-bottom-right-radius: 4px; }
.bubble-other { background: var(--bg-card, #ffffff); color: var(--text-primary, #374151); border: 1px solid var(--border-color, #e5e7eb); border-bottom-left-radius: 4px; }
.msg-time { font-size: 10px; color: var(--text-tertiary, #c0c4cc); margin-top: 3px; padding: 0 4px; }

.chat-input-area { padding: 12px 16px; border-top: 1px solid var(--border-color, #f0f0f0); background: var(--bg-card, #ffffff); flex-shrink: 0; }
.chat-input-area :deep(.el-textarea__inner) { border-radius: 10px; background: var(--bg-secondary, #f5f6fa); border: none; resize: none; }
.chat-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.input-hint { font-size: 11px; color: var(--text-tertiary, #c0c4cc); }

.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; color: var(--text-tertiary, #c0c4cc); gap: 12px;
}
.chat-empty p { font-size: 14px; margin: 0; }
</style>
