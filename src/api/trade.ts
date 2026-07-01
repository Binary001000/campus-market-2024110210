import http from './http'

export interface TradeItem {
  id?: number          // JSON Server 自动生成
  title: string        // 商品标题
  category: string     // 分类（如：数码配件、教材资料）
  price: number        // 价格
  condition: string    // 成色（全新/九成新/八成新/正常使用痕迹）
  location: string     // 交易地点
  campus: string       // 校区
  publisher: string    // 发布人
  publishTime: string  // 发布时间
  image: string        // 图片链接
  status: string       // 状态：open/closed/done
  description: string  // 详细描述
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}

export function createTrade(data: TradeItem) {
  return http.post<TradeItem>('/trades', data)
}

export function deleteTrade(id: number) {
  return http.delete(`/trades/${id}`)
}
