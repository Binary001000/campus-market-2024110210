import http from './http'

export interface NoticeRecord {
  id?: number
  userId: number
  type: 'system' | 'favorite' | 'message'
  title: string
  content: string
  read: boolean
  createdAt: string
}

export function getNotices(userId: number) {
  return http.get<NoticeRecord[]>(`/notices?userId=${userId}`)
}

export function markNoticeRead(id: number) {
  return http.patch<NoticeRecord>(`/notices/${id}`, { read: true })
}

export function markAllNoticesRead(userId: number) {
  return http.get<NoticeRecord[]>(`/notices?userId=${userId}`).then((res) => {
    const unread = res.data.filter((n) => !n.read)
    return Promise.all(unread.map((n) => http.patch(`/notices/${n.id}`, { read: true })))
  })
}
