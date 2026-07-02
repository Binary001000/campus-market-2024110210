import http from './http'

export interface ErrandItem {
  id?: number
  title: string         // 标题
  taskType: string      // 任务类型（取快递/代买/代送等）
  reward: number        // 酬劳
  from: string          // 取件地点
  to: string            // 送达地点
  deadline: string      // 截止时间
  publisher: string     // 发布人
  status: string        // 状态：open/closed/done
  description: string   // 详细描述
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function createErrand(data: ErrandItem) {
  return http.post<ErrandItem>('/errands', data)
}
export function deleteErrand(id: number) {
  return http.delete(`/errands/${id}`)
}

export function updateErrand(id: number, data: Partial<ErrandItem>) {
  return http.patch<ErrandItem>(`/errands/${id}`, data)
}
