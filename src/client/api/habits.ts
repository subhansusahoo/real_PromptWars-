// Habits API
import apiClient from './client'

export const habitAPI = {
  getHabits: () => apiClient.get('/habits'),

  getHabitById: (id: string) => apiClient.get(`/habits/${id}`),

  getPredefinedAddictions: () => apiClient.get('/habits/predefined'),

  createHabit: (data: any) => apiClient.post('/habits', data),

  updateHabit: (id: string, data: any) => apiClient.put(`/habits/${id}`, data),

  deleteHabit: (id: string) => apiClient.delete(`/habits/${id}`),

  resetStreak: (id: string) => apiClient.post(`/habits/${id}/reset-streak`, {}),
}

export const checkInAPI = {
  createCheckIn: (data: any) => apiClient.post('/checkins', data),

  getCheckIns: (habitId: string) => apiClient.get(`/checkins/habit/${habitId}`),

  getTodayCheckIn: (habitId: string) =>
    apiClient.get(`/checkins/habit/${habitId}/today`),
}

export const aiAPI = {
  getMotivationalMessage: (habitId: string) =>
    apiClient.post('/ai/motivational-message', { habitId }),

  getPanicSupport: (habitId: string) =>
    apiClient.post('/ai/panic-support', { habitId }),
}

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),

  getStats: () => apiClient.get('/user/stats'),
}
