import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as messageApi from '@/api/message'

export interface Conversation {
  id: number
  participants: number[]
  itemType: string
  itemId: number
  lastMessage: string
  lastTime: string
  unreadCount: number
  peerName?: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  createdAt: string
  isMine?: boolean
}

export const useMessageStore = defineStore('message', () => {
  const conversations = ref<Conversation[]>([])
  const messages = ref<Message[]>([])
  const currentConversationId = ref<number | null>(null)
  const loaded = ref(false)

  const totalUnread = computed(() =>
    conversations.value.reduce((sum, c) => sum + c.unreadCount, 0),
  )

  async function loadConversations() {
    try {
      const res = await messageApi.getConversations()
      conversations.value = res.data as Conversation[]
      loaded.value = true
    } catch {
      loaded.value = true
    }
  }

  async function loadMessages(conversationId: number) {
    currentConversationId.value = conversationId
    try {
      const res = await messageApi.getMessages(conversationId)
      messages.value = res.data as Message[]
    } catch {
      messages.value = []
    }
  }

  async function sendMessage(conversationId: number, senderId: number, content: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const msg: Omit<messageApi.MessageRecord, 'id'> = {
      conversationId,
      senderId,
      content,
      createdAt: now,
    }
    const res = await messageApi.sendMessage(msg)
    messages.value.push(res.data as Message)

    await messageApi.updateConversation(conversationId, {
      lastMessage: content,
      lastTime: now,
    })
    const conv = conversations.value.find((c) => c.id === conversationId)
    if (conv) {
      conv.lastMessage = content
      conv.lastTime = now
    }
  }

  async function markAsRead(conversationId: number) {
    const conv = conversations.value.find((c) => c.id === conversationId)
    if (conv && conv.unreadCount > 0) {
      conv.unreadCount = 0
      await messageApi.updateConversation(conversationId, { unreadCount: 0 })
    }
  }

  return {
    conversations,
    messages,
    currentConversationId,
    loaded,
    totalUnread,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
  }
})
