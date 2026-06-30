import http from './http'

export interface TradeItem {
  id?: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  campus: string
  publisher: string
  publishTime: string
  image: string
  status: string
  description: string
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
