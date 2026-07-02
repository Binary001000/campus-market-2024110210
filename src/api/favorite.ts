import http from './http'

export interface FavoriteRecord {
  id?: number
  userId: number
  itemType: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  itemId: number
  createdAt?: string
}

export function getFavorites() {
  return http.get<FavoriteRecord[]>('/favorites')
}

export function addFavorite(data: Omit<FavoriteRecord, 'id'>) {
  return http.post<FavoriteRecord>('/favorites', data)
}

export function removeFavorite(id: number) {
  return http.delete(`/favorites/${id}`)
}

export function getFavoriteByUserAndItem(userId: number, itemType: string, itemId: number) {
  return http.get<FavoriteRecord[]>(`/favorites?userId=${userId}&itemType=${itemType}&itemId=${itemId}`)
}
