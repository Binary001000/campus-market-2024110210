import http from './http'

export interface GroupBuyItem {
  id?: number
  title: string          // 标题
  type: string           // 拼单分类（拼餐/资料团购/运动搭子等）
  targetCount: number    // 目标人数
  currentCount: number   // 当前参与人数
  deadline: string       // 截止时间
  location: string       // 地点
  publisher: string      // 发起人
  status: string         // 状态：open/closed/done
  description: string    // 详细描述
}

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function createGroupBuy(data: GroupBuyItem) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}
