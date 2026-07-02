import http from './http'

export interface ConversationRecord {
  id?: number
  participants: number[]
  itemType: string
  itemId: number
  lastMessage: string
  lastTime: string
  unreadCount: number
}

export interface MessageRecord {
  id?: number
  conversationId: number
  senderId: number
  content: string
  createdAt: string
}

export function getConversations() {
  return http.get<ConversationRecord[]>('/conversations')
}

export function getConversationById(id: number) {
  return http.get<ConversationRecord>(`/conversations/${id}`)
}

export function getMessages(conversationId: number) {
  return http.get<MessageRecord[]>(`/messages?conversationId=${conversationId}`)
}

export function sendMessage(data: Omit<MessageRecord, 'id'>) {
  return http.post<MessageRecord>('/messages', data)
}

export function createConversation(data: Omit<ConversationRecord, 'id'>) {
  return http.post<ConversationRecord>('/conversations', data)
}

export function updateConversation(id: number, data: Partial<ConversationRecord>) {
  return http.patch<ConversationRecord>(`/conversations/${id}`, data)
}
