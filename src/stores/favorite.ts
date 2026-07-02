import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import * as favoriteApi from '@/api/favorite'

export interface FavoriteItem {
  id: number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  title: string
  description: string
  location?: string
}

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<FavoriteItem[]>([])
  const loaded = ref(false)

  const favoriteCount = computed(() => favorites.value.length)

  async function loadFavorites() {
    const userStore = useUserStore()
    try {
      const res = await favoriteApi.getFavorites()
      const records = res.data.filter((r) => r.userId === userStore.currentUser.id)
      favorites.value = records.map((r) => ({
        id: r.itemId,
        type: r.itemType as FavoriteItem['type'],
        title: '',
        description: '',
      }))
      loaded.value = true
    } catch {
      loaded.value = true
    }
  }

  function isFavorite(type: FavoriteItem['type'], id: number) {
    return favorites.value.some((item) => item.type === type && item.id === id)
  }

  async function addFavorite(item: FavoriteItem) {
    if (isFavorite(item.type, item.id)) return
    const userStore = useUserStore()
    await favoriteApi.addFavorite({
      userId: userStore.currentUser.id,
      itemType: item.type,
      itemId: item.id,
    })
    favorites.value.push({ ...item })
  }

  async function removeFavorite(type: FavoriteItem['type'], id: number) {
    const userStore = useUserStore()
    try {
      const res = await favoriteApi.getFavoriteByUserAndItem(userStore.currentUser.id, type, id)
      for (const record of res.data) {
        if (record.id) await favoriteApi.removeFavorite(record.id)
      }
    } catch {
      // ignore
    }
    favorites.value = favorites.value.filter((item) => !(item.type === type && item.id === id))
  }

  async function toggleFavorite(item: FavoriteItem) {
    if (isFavorite(item.type, item.id)) {
      await removeFavorite(item.type, item.id)
    } else {
      await addFavorite(item)
    }
  }

  async function updateItemInfo(type: FavoriteItem['type'], id: number, info: { title: string; description: string; location?: string }) {
    const existing = favorites.value.find((f) => f.type === type && f.id === id)
    if (existing) {
      existing.title = info.title
      existing.description = info.description
      if (info.location) existing.location = info.location
    }
  }

  return {
    favorites,
    loaded,
    favoriteCount,
    loadFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    updateItemInfo,
  }
})
