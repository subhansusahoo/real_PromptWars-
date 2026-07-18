// Habits store with Zustand
import { create } from 'zustand'
import { habitAPI } from '../api/habits'

interface Habit {
  id: string
  name: string
  category: string
  description?: string
  reason?: string
  startDate: string
  streakCount: number
  longestStreak: number
  totalCheckIns: number
  successfulDays: number
  failedDays: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface HabitsStore {
  habits: Habit[]
  selectedHabit: Habit | null
  isLoading: boolean
  error: string | null

  fetchHabits: () => Promise<void>
  fetchHabitById: (id: string) => Promise<Habit>
  createHabit: (data: any) => Promise<Habit>
  updateHabit: (id: string, data: any) => Promise<Habit>
  deleteHabit: (id: string) => Promise<void>
  resetStreak: (id: string) => Promise<void>
  setSelectedHabit: (habit: Habit | null) => void
}

export const useHabitsStore = create<HabitsStore>((set) => ({
  habits: [],
  selectedHabit: null,
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await habitAPI.getHabits()
      set({ habits: response.data })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchHabitById: async (id: string) => {
    try {
      set({ isLoading: true })
      const response = await habitAPI.getHabitById(id)
      return response.data
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  createHabit: async (data: any) => {
    try {
      set({ isLoading: true, error: null })
      const response = await habitAPI.createHabit(data)
      set((state) => ({
        habits: [response.data, ...state.habits],
      }))
      return response.data
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateHabit: async (id: string, data: any) => {
    try {
      set({ isLoading: true, error: null })
      const response = await habitAPI.updateHabit(id, data)
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? response.data : h)),
      }))
      return response.data
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteHabit: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await habitAPI.deleteHabit(id)
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  resetStreak: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await habitAPI.resetStreak(id)
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? response.data : h)),
      }))
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  setSelectedHabit: (habit) => {
    set({ selectedHabit: habit })
  },
}))
