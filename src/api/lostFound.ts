import http from './http'

export interface LostFoundItem {
  id?: number
  title: string         // 标题
  type: 'lost' | 'found' // 类型：丢失 / 拾获
  itemName: string      // 物品名称
  location: string      // 地点
  eventTime: string     // 发生时间
  contact: string       // 联系方式
  publisher: string     // 发布人
  status: string        // 状态：open/closed/done
  description: string   // 详细描述
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function createLostFound(data: LostFoundItem) {
  return http.post<LostFoundItem>('/lostFounds', data)
}
