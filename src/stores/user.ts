import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

const STORAGE_KEY = 'campus-market-user'

function loadState(): { isLoggedIn: boolean; currentUser: CurrentUser } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return {
    isLoggedIn: false,
    currentUser: {
      id: 0,
      name: '',
      college: '',
      grade: '',
      avatar: '',
      bio: '',
    },
  }
}

function saveState(state: { isLoggedIn: boolean; currentUser: CurrentUser }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

export const useUserStore = defineStore('user', {
  state: () => loadState(),

  getters: {
    displayName: (state) => state.currentUser.name || '未登录',
    userDescription: (state) => {
      if (!state.currentUser.college) return ''
      return `${state.currentUser.college} · ${state.currentUser.grade}`
    },
  },

  actions: {
    setUser(user: CurrentUser) {
      this.currentUser = user
      this.isLoggedIn = true
      saveState({ isLoggedIn: true, currentUser: user })
    },

    updateProfile(payload: Partial<CurrentUser>) {
      this.currentUser = { ...this.currentUser, ...payload }
      saveState({ isLoggedIn: this.isLoggedIn, currentUser: this.currentUser })
    },

    logout() {
      this.isLoggedIn = false
      this.currentUser = { id: 0, name: '', college: '', grade: '', avatar: '', bio: '' }
      saveState({ isLoggedIn: false, currentUser: this.currentUser })
    },

    login() {
      this.isLoggedIn = true
      saveState({ isLoggedIn: true, currentUser: this.currentUser })
    },
  },
})
