import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  initializeFromStorage: () => void
}

// Get stored user from localStorage
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to parse stored user:', error)
    return null
  }
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: getStoredUser(),
  isLoading: false,
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
    set({ user, isLoading: false })
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  clearAuth: () => {
    localStorage.removeItem('auth_user')
    set({ user: null, isLoading: false })
  },
  initializeFromStorage: () => {
    const user = getStoredUser()
    set({ user, isLoading: false })
  },
}))
