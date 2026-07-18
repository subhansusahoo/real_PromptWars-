// Authentication store with Zustand
import { create } from 'zustand'
import { authAPI } from '../api/auth'

interface User {
  id: string
  email: string
  name: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authAPI.login(email, password)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      set({ error: message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authAPI.register(email, password, name)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ error: message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  checkAuth: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        })
      } catch {
        set({ isLoading: false })
      }
    }
    set({ isLoading: false })
  },
}))
